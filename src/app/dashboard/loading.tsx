export default function DashboardLoading() {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-9 w-48 bg-muted animate-pulse rounded-md"></div>
          <div className="h-5 w-64 bg-muted animate-pulse rounded-md mt-2"></div>
        </div>
        <div className="h-10 w-32 bg-muted animate-pulse rounded-md"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col justify-between border rounded-lg bg-card h-40 shadow-sm animate-pulse">
            <div className="p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-md bg-muted"></div>
              <div className="space-y-2 flex-1 mt-1">
                <div className="h-5 w-3/4 bg-muted rounded-md"></div>
                <div className="h-4 w-1/2 bg-muted rounded-md"></div>
              </div>
            </div>
            <div className="px-5 py-3 border-t bg-muted/20 flex justify-end">
              <div className="h-5 w-24 bg-muted rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
