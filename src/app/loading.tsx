const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 border-4 border-t-primary/50 border-r-transparent border-b-transparent border-l-primary/50 rounded-full animate-spin-slow"></div>
      </div>
    </div>
  );
};

export default Loading;
