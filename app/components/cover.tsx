type CoverProps = {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
};

export default function Cover({
  title,
  subtitle,
  backgroundImage,
}: CoverProps) {
  return (
    <section
      className="w-full min-h-[60vh] h-[60vh] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-center px-4"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "",
      }}
    >
      {(title || subtitle) && (
        <div className="bg-white bg-opacity-90 text-black p-6 rounded shadow max-w-2xl">
          {title && <h1 className="text-4xl font-bold mb-2">{title}</h1>}
          {subtitle && <p className="text-lg">{subtitle}</p>}
        </div>
      )}
    </section>
  );
}
