import Image from "next/image";

type Props = {
  src?: string | null;
  className?: string;
};

export const ProfileImage = (props: Props) => {
  const { src, className = "" } = props;

  return (
    <div
      className={`relative h-12 w-12 overflow-hidden rounded-full ${className}`}
    >
      {src ? (
        <Image src={src} alt="User profile image" quality={100} fill />
      ) : null}
    </div>
  );
};
