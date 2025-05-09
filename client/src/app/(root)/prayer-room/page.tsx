
"use client";

import Filters from "@/components/Filters/Filters";
import PrayerCard from "@/components/PrayerCard/PrayerCard";
import Pagination from "@/components/Pagination/Pagination";
import PrayerPopup from "@/components/PrayerPopup/PrayerPopup";
import { useEffect, useState } from "react";
import useFetch from "@/hook/useFetch";
import { IPrayer } from "@/Interface/IPrayer";
import { Data } from "@/Interface/Data";
import ComponentsLoader from "@/components/ComponentsLoader/ComponentsLoader";
import { getMyPrayersEndpoint, getAllPrayersEndpoint } from "@/endpoint/Prayer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DeleteConfirmation from "@/components/DeleteConfirmation/DeleteConfirmation";

// Icons
import { MdAdd } from "react-icons/md";
import PrayerEdit from "@/components/PrayerEdit/PrayerEdit";
import { getSocket } from "@/services/socket";
import { toast } from "react-toastify";
import { useDebounce } from "@/hook/useDebounce";

// const mockPrayerCards: PrayerCardProps[] = [
//     {
//         currentUser: true,
//         name: "Sarah Johnson",
//         image: "/images/pexels-photo.jpeg",
//         timestamp: "Il y a 2 heures",
//         prayer: "Please pray for my upcoming surgery. I’m feeling anxious and need peace.",
//         prayerStats: 12,
//         className: "current-user",
//         online: true
//     },
//     {
//         name: "David Kim",
//         image: "/images/homme.jpeg",
//         timestamp: "Il y a 5 heures",
//         prayer: "Asking for strength and guidance as I search for a new job. lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolor dolore lorem ipsum dolor sit amet consectetur.",
//         prayerStats: 23,
//         urgent: true
//     },
//     {
//         name: "Maria Lopez",
//         image: "/images/madame.jpeg",
//         timestamp: "Il y a 6 heures",
//         prayer: "My family is going through a hard time. Please keep us in your thoughts. ",
//         prayerStats: 34,
//         className: "praying-for",
//         online: true,
//         prayeringFor: true
//     },
//     {
//         name: "James Allen",
//         image: "/images/Lucas.jpeg",
//         timestamp: "Il y a 8 heures",
//         prayer: "I’m feeling spiritually distant lately. Pray for renewed faith.",
//         prayerStats: 8,
//     },
//     {
//         name: "Sarah Johnson",
//         image: "/images/pexels-photo.jpeg",
//         timestamp: "Il y a 2 heures",
//         prayer: "Please pray for my upcoming surgery. I’m feeling anxious and need peace.",
//         prayerStats: 12,
//         className: "current-user",
//         online: true
//     },
//     {
//         name: "David Kim",
//         image: "/images/homme.jpeg",
//         timestamp: "Il y a 5 heures",
//         prayer: "Asking for strength and guidance as I search for a new job. lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolor.",
//         prayerStats: 23,
//         urgent: true
//     },
//     {
//         name: "Maria Lopez",
//         image: "/images/madame.jpeg",
//         timestamp: "Il y a 6 heures",
//         prayer: "My family is going through a hard time. Please keep us in your thoughts. ",
//         prayerStats: 34,
//         className: "praying-for",
//         online: true,
//         prayeringFor: true
//     },
//     {
//         name: "James Allen",
//         image: "/images/Lucas.jpeg",
//         timestamp: "Il y a 8 heures",
//         prayer: "I’m feeling spiritually distant lately. Pray for renewed faith.",
//         prayerStats: 8,
//     },
//     {
//         name: "James Allen",
//         image: "/images/Lucas.jpeg",
//         timestamp: "Il y a 8 heures",
//         prayer: "I’m feeling spiritually distant lately. Pray for renewed faith.",
//         prayerStats: 8,
//     }
// ];

function PrayerRoom() {

    const [makeRequest, setMakeRequest] = useState(false);
    const [selectedPrayerId, setSelectedPrayerId] = useState<string | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [prayerToEdit, setPrayerToEdit] = useState<IPrayer | null>(null);

    // Filters Buttons
    const [filters, setFilters] = useState("");

    // Search input
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 400); // 400ms d'attente

    const { fetchData } = useFetch(true);
    const queryClient = useQueryClient();

    // get my prayers
    const { data: myPrayers, isLoading: isMyPrayersLoading, error: myPrayersError } = useQuery({
        queryKey: ['myPrayers'],
        queryFn: () => fetchData<Data<IPrayer[]>>(getMyPrayersEndpoint),
    });

    // get all prayers
    const { data: allPrayers, isLoading: isAllPrayersLoading, error: allPrayersError } = useQuery({
        queryKey: ['allPrayers', filters, debouncedSearch],
        queryFn: () =>
            fetchData<Data<IPrayer[]>>(
                `${getAllPrayersEndpoint}?filter=${filters}&search=${encodeURIComponent(debouncedSearch)}`
            ),
        enabled: !!debouncedSearch || filters !== "" || filters === "",


        refetchOnWindowFocus: true,
        refetchInterval: 30000,
        refetchIntervalInBackground: false,
        staleTime: 30000,
    });


    const handleDeleteClick = (id: string) => {
        setSelectedPrayerId(id);
        setShowDeletePopup(true);
    };


    const handleEditClick = (prayer: IPrayer) => {
        setPrayerToEdit(prayer);
        setShowEditPopup(true);
    };


    useEffect(() => {
        const socket = getSocket();

        if (socket) {
            socket.on('prayedForNotification', (data) => {
                if (data) {
                    queryClient.invalidateQueries({ queryKey: ['myPrayers'] });
                    toast.success("Someone prayed for you 🙏");
                }
            });
            ['likeNotification', 'likeRemovedNotification'].forEach(event => {
                socket.on(event, (data) => {
                    if (data) {
                        queryClient.invalidateQueries({ queryKey: ['myPrayers'] });
                    }
                });
            });
        }

        return () => {
            // Nettoyer l'écouteur lors de la déconnexion du composant
            const socket = getSocket();
            if (socket) {
                socket.off('prayedForNotification');
                socket.off('likeNotification');
            }
        };
    }, [queryClient]);


    return (
        <>
            <section className="prayer-room">
                <Filters search={search} setSearch={setSearch} filter={filters} setFilter={setFilters} />

                {/* Get my prayers */}
                <div className="max-w-[1200px] mx-auto grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 p-4">
                    {!myPrayersError ? (
                        isMyPrayersLoading ? (
                            <ComponentsLoader />
                        ) : (
                            (myPrayers && myPrayers.data.length > 0) ? (
                                myPrayers.data.map((card, index) => (
                                    <PrayerCard
                                        key={index}
                                        prayer={card}
                                        currentUser
                                        className="border-primary"
                                        onDelete={() => handleDeleteClick(card._id)}
                                        onEdit={() => handleEditClick(card)}
                                    />
                                ))
                            ) : (
                                null
                            )
                        )
                    ) : (
                        <div className="text-red-600">Error: {myPrayersError?.message}</div>
                    )}

                    {/* Get all prayers */}
                    {!allPrayersError ? (
                        isAllPrayersLoading ? (
                            <ComponentsLoader />
                        ) : (
                            (allPrayers && allPrayers?.data.length > 0) ? (
                                allPrayers.data.map((card, index) => (
                                    <PrayerCard
                                        key={index}
                                        prayer={card}
                                        className={card.isPrayed ? 'praying-for' : ''}
                                        prayeringFor={card.isPrayed}
                                        likedBy={card.isLiked}
                                    />
                                ))
                            ) : (
                                null
                            )
                        )
                    ) : (
                        <div className="text-red-600">Error: {myPrayersError?.message}</div>
                    )}
                </div>

                <Pagination />
            </section>


            <button onClick={() => setMakeRequest(true)} className="w-12 h-12 btn btn-circle fixed bottom-16 right-8 shadow-sm hover:shadow-lg hover:scale-110 transition-all duration-300 z-50 border-primary">
                <MdAdd className="text-3xl" />
            </button>

            <PrayerPopup
                makeRequest={makeRequest}
                setMakeRequest={setMakeRequest}
            />

            <DeleteConfirmation
                selectedPrayerId={selectedPrayerId}
                showDeletePopup={showDeletePopup}
                setShowDeletePopup={setShowDeletePopup}
            />

            <PrayerEdit
                openPopupEdit={showEditPopup}
                setOpenPopupEdit={setShowEditPopup}
                prayerToEdit={prayerToEdit}
            />
        </>
    );
}

export default PrayerRoom;