const DashboardHeader = () => {
    return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Book Stacks Dashboard</h1>
          <p className="text-gray-600">Welcome back, Admin! Here's what's happening with your book platform.</p>
        </div>
      </div>
    );
  };
  
  export default DashboardHeader;
  