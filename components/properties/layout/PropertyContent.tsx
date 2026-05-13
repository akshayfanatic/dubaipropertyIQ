type PropertyContentProps = {
  SidebarContent?: React.ReactNode;
  children: React.ReactNode;
};

export const PropertyContentLayout = ({ SidebarContent, children }: PropertyContentProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-12 sm:py-8 py-2">
      <div className="flex-2 space-y-2">{children}</div>
      <aside className="md:w-1/3 w-full shrink-0">
        <div className="sticky top-24">{SidebarContent}</div>
      </aside>
    </div>
  );
};
