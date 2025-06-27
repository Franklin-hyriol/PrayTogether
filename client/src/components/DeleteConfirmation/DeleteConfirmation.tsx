import { useEffect, useRef, useState } from "react";
import "./DeleteConfirmation.scss";
import useDelete from "@/hook/useDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePrayerByIdEndpoint } from "@/endpoint/Prayer";
import { Data } from "@/Interface/Data";
import { toast } from "react-toastify";
import ComponentsLoader from "../ComponentsLoader/ComponentsLoader";


interface DeleteConfirmationProps {
    selectedPrayerId: string | null,
    showDeletePopup: boolean,
    setShowDeletePopup: React.Dispatch<React.SetStateAction<boolean>>
}


function DeleteConfirmation({ selectedPrayerId, showDeletePopup, setShowDeletePopup }: DeleteConfirmationProps) {

    const contentRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

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
        <>
            <div
                ref={overlayRef}
                className={`popup-overlay ${showDeletePopup ? "active" : ""}`}
                id="deleteConfirmationPopup"
            >
                <div className="card w-96 bg-base-100 card-md shadow-sm" ref={contentRef}>
                    <div className="card-body text-center">

                        <h2 className="card-title">Confirm Deletion</h2>
                        <p className="mb-2">Are you sure you want to delete this prayer? <br /><span className="text-error">This action is irreversible.</span></p>
                        <div className="justify-center gap-4 card-actions">
                            <button type="button" className="btn" onClick={() => setShowDeletePopup(false)}>Cancel</button>
                            <button type="button" disabled={deletePrayerMutation.isPending} className="btn btn-error text-white" onClick={handleDelete}>{deletePrayerMutation.isPending ? <ComponentsLoader /> : "Delete"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeleteConfirmation;