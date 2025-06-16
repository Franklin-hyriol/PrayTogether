import { useEffect, useRef, useState } from "react";
import useDelete from "@/hook/useDelete";
import { useMutation } from "@tanstack/react-query";
import { Data } from "@/Interface/Data";
import { toast } from "react-toastify";
import { deleteUserEndpoint } from "@/endpoint/User";
import "./DeleteCompteConfirmation.scss";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface DeleteCompteConfirmationProps {
  showDeletePopup: boolean;
  setShowDeletePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

function DeleteCompteConfirmation({
  showDeletePopup,
  setShowDeletePopup,
}: DeleteCompteConfirmationProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const { user, setUser, setAccessToken } = useAuth();

  const { deleteData } = useDelete(true);

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) =>
      deleteData<Data<{ _id: string }>>(deleteUserEndpoint(id)),
    onSuccess: (response) => {
      if (response?.status === 200) {
        toast.success("User deleted successful!");

        setTimeout(() => {
          setShowDeletePopup(false);
          setUser(null);
          setAccessToken(null);
          router.push("/");
        }, 500);
      }
    },

    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
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
    if (user?.id) {
      deleteUserMutation.mutate(user.id);
    }
  };

  if (!visible) return null;

  return (
    <>
      <div
        ref={overlayRef}
        className={`popup-overlay ${showDeletePopup ? "active" : ""}`}
        id="deleteCompteConfirmationPopup"
      >
        <div
          className="card bg-base-100 card-md w-96 shadow-sm"
          ref={contentRef}
        >
          <div className="card-body text-center">
            <h2 className="card-title">Confirm Account Deletion</h2>
            <p className="mb-2">
              Are you sure you want to delete your account? <br />
              <span className="text-error">
                This action is irreversible and will delete all your data.
              </span>
            </p>
            <div className="card-actions justify-center gap-4">
              <button
                type="button"
                className="btn"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-error text-white"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteCompteConfirmation;
