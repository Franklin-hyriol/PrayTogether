import { useEffect, useRef, useState } from "react";
import "./PrayingForYou.scss";
import PrayerPerson from "../PrayerPerson/PrayerPerson";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPeopleWhoPrayedEndpoint } from "@/endpoint/Prayer";
import useFetch from "@/hook/useFetch";
import { IPrayingForYou } from "@/Interface/IPrayingForYou";
import { Data } from "@/Interface/Data";
import { useInView } from "react-intersection-observer";
import ComponentsLoader from "../ComponentsLoader/ComponentsLoader";

interface PrayingForYouProps {
  selectedPrayerId: string | null;
  showPeoplePrayingPopup: boolean;
  setShowPeoplePrayingPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

function PrayingForYou({
  selectedPrayerId,
  showPeoplePrayingPopup,
  setShowPeoplePrayingPopup,
}: PrayingForYouProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollPeopleRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { fetchData } = useFetch(true);

  // Ref pour l'infinite scroll des personnes qui prient
  const { ref: refPeople, inView: inViewPeople } = useInView();

  const {
    data: peopleWhoPrayed,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error: peopleWhoPrayedError,
    isLoading: isPeopleWhoPrayedLoading,
  } = useInfiniteQuery({
    queryKey: ["peopleWhoPrayed", selectedPrayerId],
    queryFn: ({ pageParam = 1 }) =>
      fetchData<Data<IPrayingForYou[]>>(
        getPeopleWhoPrayedEndpoint(selectedPrayerId as string, pageParam, 4)
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.pagination?.hasNextPage ? nextPage : undefined;
    },
    enabled: !!selectedPrayerId && showPeoplePrayingPopup,
  });

  // Scroll infinite
  useEffect(() => {
    if (inViewPeople && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inViewPeople, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (showPeoplePrayingPopup) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [showPeoplePrayingPopup]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const overlay = overlayRef.current;
      const content = contentRef.current;
      if (
        overlay?.classList.contains("active") &&
        content &&
        !content.contains(event.target as Node)
      ) {
        setShowPeoplePrayingPopup(false);
      }
    };

    if (showPeoplePrayingPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPeoplePrayingPopup, setShowPeoplePrayingPopup]);

  if (!visible) return null;

  return (
    <>
      <div
        ref={overlayRef}
        className={`popup-overlay ${showPeoplePrayingPopup ? "active" : ""}`}
        id="prayingForYou"
      >
        <div
          className="card bg-base-100 card-md w-96 shadow-sm"
          ref={contentRef}
        >
          <div className="card-body">
            <h2 className="card-title">People praying for you</h2>
            <div 
              className="relative flex max-h-[310px] min-h-fit w-full flex-col gap-2 overflow-y-auto p-1"
              ref={scrollPeopleRef}
            >
              {peopleWhoPrayedError ? (
                <p className="text-error text-center py-4">
                  {peopleWhoPrayedError.message}
                </p>
              ) : isPeopleWhoPrayedLoading ? (
                <ComponentsLoader className="absolute top-1/2 left-1/2" />
              ) : peopleWhoPrayed?.pages.flatMap((page) => page.data).length === 0 ? (
                <p className="flex items-center justify-center gap-2 py-4 text-sm text-gray-500 italic">
                  <span role="img" aria-label="Praying hands">
                    🙏
                  </span>
                  No one is praying for you yet.
                </p>
              ) : (
                peopleWhoPrayed?.pages.map((page) =>
                  page.data.map((person) => (
                    <PrayerPerson key={person.user._id} PeoplePraying={person} />
                  ))
                )
              )}

              {hasNextPage && (
                <div ref={refPeople} className="mx-auto my-4">
                  <ComponentsLoader />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrayingForYou;