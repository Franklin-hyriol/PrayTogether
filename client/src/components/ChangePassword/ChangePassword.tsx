import "./ChangePassword.scss";

// Icons
import { MdLockOutline } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import usePatch from "@/hook/usePatch";
import { useMutation } from "@tanstack/react-query";
import { User } from "@/Interface/User";
import { Data } from "@/Interface/Data";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { updateUserEndpoint } from "@/endpoint/User";

type ChangePasswordProps = {
  className?: string;
};

const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .nonempty({ message: "Password cannot be empty" }),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .nonempty({ message: "Password cannot be empty" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Passwords do not match" })
    .nonempty({ message: "Password cannot be empty" }),
});

type IPassword = z.infer<typeof updatePasswordSchema>;

const defaultValues = {
  password: "",
  newPassword: "",
  confirmPassword: "",
};

function ChangePassword({ className }: ChangePasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user } = useAuth();

  const { patchData } = usePatch(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    trigger,
  } = useForm<IPassword>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues,
    mode: "onChange",
  });
  

  const updatePasswordMutation = useMutation({
    mutationFn: (data: IPassword) =>
      patchData<Data<User>>(updateUserEndpoint(user?.id as string), data),
    onSuccess: (response) => {
      if (response?.status === 200) {
        toast.success("Password update successful!");
        reset();
      }
    },
  });

  const onSubmit = async (data: IPassword) => {
	updatePasswordMutation.mutate(data);
  };

  return (
    <form
      className={"form-section flex flex-col gap-6" + " " + className}
      onSubmit={handleSubmit(onSubmit)}
    >

		{/* Error */}
      <div
        role="alert"
        className={`alert alert-error mb-6 ${updatePasswordMutation.isError ? "flex" : "hidden"}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{updatePasswordMutation.error?.message}</span>
      </div>
	  {/* Error */}

    <input type="text" defaultValue={user?.username} name="username" autoComplete="username" style={{ display: "none" }} aria-hidden="true" />

      {/* Password */}
      <div className="space-y-1">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-base-content"
        >
          Password
        </label>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdLockOutline />
          </div>
          <input
            {...register("password")}
            onBlur={() => trigger("password")}
            autoComplete="new-password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`block w-full rounded-lg border py-3 pl-10 text-base-content focus:outline-none focus:ring-primary sm:text-sm ${errors.password?.message ? "border-red-400" : "border-gray-300"}`}
            maxLength={250}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              className="text-base-content hover:text-base-400 focus:outline-none cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaRegEye className="text-xl" />
              ) : (
                <FaRegEyeSlash className="text-xl" />
              )}
            </button>
          </div>
        </div>
        {errors.password?.message && (
          <div className="validator-hint visible block text-red-400">
            {errors.password?.message}
          </div>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-1">
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-base-content"
        >
          New Password
        </label>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdLockOutline />
          </div>
          <input
            {...register("newPassword")}
            onBlur={() => trigger("newPassword")}
            autoComplete="new-password"
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            className={`block w-full rounded-lg border py-3 pl-10 text-base-content focus:outline-none focus:ring-primary sm:text-sm ${errors.newPassword?.message ? "border-red-400" : "border-gray-300"}`}
            maxLength={250}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              className="text-base-content hover:text-base-400 focus:outline-none cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <FaRegEye className="text-xl" />
              ) : (
                <FaRegEyeSlash className="text-xl" />
              )}
            </button>
          </div>
        </div>
        {errors.newPassword?.message && (
          <div className="validator-hint visible block text-red-400">
            {errors.newPassword?.message}
          </div>
        )}
      </div>

      {/*Confirm Password */}
      <div className="space-y-1">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-base-content"
        >
          Confirm Password
        </label>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdLockOutline />
          </div>
          <input
            {...register("confirmPassword")}
            onBlur={() => trigger("confirmPassword")}
            autoComplete="new-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className={`block w-full rounded-lg border py-3 pl-10 text-base-content focus:outline-none focus:ring-primary sm:text-sm ${errors.confirmPassword?.message ? "border-red-400" : "border-gray-300"}`}
            maxLength={250}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              className="text-base-content hover:text-base-400 focus:outline-none cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FaRegEye className="text-xl" />
              ) : (
                <FaRegEyeSlash className="text-xl" />
              )}
            </button>
          </div>
        </div>
        {errors.confirmPassword?.message && (
          <div className="validator-hint visible block text-red-400">
            {errors.confirmPassword?.message}
          </div>
        )}
      </div>

      <div className="form-buttons">
        <button
          type="submit"
          className="btn btn-primary text-base"
          disabled={!isValid}
        >
          Update password
        </button>
      </div>
    </form>
  );
}

export default ChangePassword;
