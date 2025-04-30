
"use client";

import Filters from "@/components/Filters/Filters";
import "./prayer-room.scss";
import PrayerCard from "@/components/PrayerCard/PrayerCard";
import Pagination from "@/components/Pagination/Pagination";
import PrayerPopup from "@/components/PrayerPopup/PrayerPopup";
import { useState } from "react";
import useFetch from "@/hook/useFetch";
import { IPrayer } from "@/Interface/IPrayer";
import { Data } from "@/Interface/Data";
import ComponentsLoader from "@/components/ComponentsLoader/ComponentsLoader";
import { getMyPrayersEndpoint, getPrayersEndpointWithFilter } from "@/endpoint/Prayer";
import { useQuery } from "@tanstack/react-query";
import DeleteConfirmation from "@/components/DeleteConfirmation/DeleteConfirmation";

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

    const { fetchData } = useFetch(true);


    const { data: myPrayers, isLoading: isMyPrayersLoading, error: myPrayersError } = useQuery({
        queryKey: ['myPrayers'],
        queryFn: () => fetchData<Data<IPrayer[]>>(getMyPrayersEndpoint),
    });


    const { data: allPrayers, isLoading: isAllPrayersLoading, error: allPrayersError } = useQuery({
        queryKey: ['allPrayers'],
        queryFn: () => fetchData<Data<IPrayer[]>>(getPrayersEndpointWithFilter),
    });


    const handleDeleteClick = (id: string) => {
        setSelectedPrayerId(id);
        setShowDeletePopup(true);
    };


    return (
        <>
            <section className="prayer-room">
                <Filters />

                {/* Get my prayers */}
                <div className="prayer-cards-grid">
                    {!myPrayersError ? (
                        isMyPrayersLoading ? (
                            <ComponentsLoader />
                        ) : (
                            (myPrayers && myPrayers.data.length > 0) && (
                                myPrayers.data.map((card, index) => (
                                    <PrayerCard
                                        key={index}
                                        prayer={card}
                                        currentUser
                                        className="current-user"
                                        onDelete={() => handleDeleteClick(card._id)}
                                    />
                                ))
                            )
                        )
                    ) : (
                        <div>Une erreur est survenue</div>
                    )}

                    {/* Get all prayers */}
                    {!allPrayersError ? (
                        isAllPrayersLoading ? (
                            <ComponentsLoader />
                        ) : (
                            (allPrayers && allPrayers?.data.length > 0) && (
                                allPrayers.data.map((card, index) => (
                                    <PrayerCard
                                        key={index}
                                        prayer={card}
                                        className=""
                                    />
                                ))
                            )
                        )
                    ) : (
                        <div>Une erreur est survenue</div>
                    )}
                </div>

                <Pagination />
            </section>

            <button onClick={() => setMakeRequest(true)} className="send-prayer">+</button>

            <PrayerPopup
                makeRequest={makeRequest}
                setMakeRequest={setMakeRequest}
            />

            <DeleteConfirmation
                selectedPrayerId={selectedPrayerId}
                showDeletePopup={showDeletePopup}
                setShowDeletePopup={setShowDeletePopup}
            />
        </>
    );
}

export default PrayerRoom;