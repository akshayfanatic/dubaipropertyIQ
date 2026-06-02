type PropertyContentProps = {
  SidebarContent?: React.ReactNode;
  children: React.ReactNode;
};

export const PropertyContentLayout = ({ SidebarContent, children }: PropertyContentProps) => {
  return (
    <div className="flex flex-col gap-12 py-8 sm:py-12 lg:flex-row">
      <div className="flex-2 space-y-12">{children}</div>
      <aside className="lg:w-1/3 w-full shrink-0">
        <div className="sticky top-24">{SidebarContent}</div>
      </aside>
    </div>
  );
};
