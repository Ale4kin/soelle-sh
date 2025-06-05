type CoverProps = {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
};

export default function Cove({ title, subtitle, backgroundImage }: CoverProps) {
  return (
    <section
      className="w-full min-h-[60vh] h-[60vh] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-center px-4"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "",
      }}
    >
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      {subtitle && <p className="text-lg max-w-2xl mx-auto">{subtitle}</p>}
    </section>
  );
}
