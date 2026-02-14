
export default function VideoPlayer({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-white font-semibold text-lg drop-shadow-md">{title}</h3>
      </div>
    </div>
  );
}
