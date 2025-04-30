import { useEffect, useRef, useState } from "react";
import "./DeleteConfirmation.scss";
import useDelete from "@/hook/useDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePrayerByIdEndpoint } from "@/endpoint/Prayer";
import { Data } from "@/Interface/Data";
import { toast, ToastContainer } from "react-toastify";


interface DeleteConfirmationProps {
    selectedPrayerId: string | null,
    showDeletePopup: boolean,
    setShowDeletePopup: React.Dispatch<React.SetStateAction<boolean>>
}


function DeleteConfirmation({ selectedPrayerId, showDeletePopup, setShowDeletePopup }: DeleteConfirmationProps) {

    const contentRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    console.log(selectedPrayerId);

    const { deleteData } = useDelete(true);
    const queryClient = useQueryClient();


    const deletePrayerMutation = useMutation({
        mutationFn: (id: string) => deleteData<Data<{ _id: string }>>(`${deletePrayerByIdEndpoint}/${id}`),
        onSuccess: (response) => {
            if (response?.status === 200) {
                toast.success("Prayer deleted successful!");

                queryClient.invalidateQueries({ queryKey: ['myPrayers'] });

                setTimeout(() => {
                    setShowDeletePopup(false);
                }, 500);
            }
        },

        onError: (error) => {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    });



    useEffect(() => {
        if (showDeletePopup) {
            setVisible(true);
        } else {
            const timeout = setTimeout(() => setVisible(false), 100); // délai = durée transition
            return () => clearTimeout(timeout);
        }
    }, [showDeletePopup]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const overlay = overlayRef.current;
            const content = contentRef.current;

            if (
                overlay?.classList.contains("active") &&
                content &&
                !content.contains(event.target as Node)
            ) {
                setShowDeletePopup(false);
            }
        };

        if (showDeletePopup) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDeletePopup, setShowDeletePopup]);

    const handleDelete = () => {
        if (selectedPrayerId) {
            deletePrayerMutation.mutate(selectedPrayerId);
        }
    }

    if (!visible) return null;


    return (
        <div
            ref={overlayRef}
            className={`popup-overlay ${showDeletePopup ? "active" : ""}`}
            id="deleteConfirmationPopup"
        >
            <div className="popup-content confirmation-popup" ref={contentRef}>
                <div className="popup-header">
                    <h2>Confirmer la suppression</h2>
                </div>
                <div className="confirmation-content">
                    <p>Êtes-vous sûr de vouloir supprimer cette prière ?</p>
                    <p className="confirmation-warning">Cette action est irréversible.</p>
                    <div className="confirmation-actions">
                        <button className="confirmation-btn cancel-btn" onClick={() => setShowDeletePopup(false)}>Annuler</button>
                        <button className="confirmation-btn delete-btn" onClick={handleDelete}>Supprimer</button>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={2000} style={{ zIndex: 2000 }} />
        </div>
    )
}

export default DeleteConfirmation;