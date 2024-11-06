
const DashboardStats = ({totalTransactions, pendingTransactions, successfulTransactions, failedTransactions}: {totalTransactions: number, pendingTransactions: number, successfulTransactions: number, failedTransactions: number}) => {
    return (
        <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="p-4  rounded-lg text-center">
                <h3 className="text-lg  mb-2 text-white">Total Transactions</h3>
                <div className="mt-2 border-t border-dashed border-white opacity-40" />
                <p className="text-white font-semibold text-2xl">{totalTransactions}</p>
            </div>
            <div className="p-4  rounded-lg text-center">
                <h3 className="text-lg  mb-2 text-white">Pending Transactions</h3>
                <div className="mt-2 border-t border-dashed border-white opacity-40" />

                <p className="text-white font-semibold text-2xl">{pendingTransactions}</p>
            </div>
            <div className="p-4  rounded-lg text-center">
                <h3 className="text-lg  mb-2 text-white">Successfull Transactions</h3>
                <div className="mt-2 border-t border-dashed border-white opacity-40" />
                <p className="text-white font-semibold text-2xl">{successfulTransactions}</p>
            </div>
            <div className="p-4  rounded-lg text-center">
                <h3 className="text-lg  mb-2 text-white">Failed Transactions</h3>
                <div className="mt-2 border-t border-dashed border-white opacity-40" />
                <p className="text-white font-semibold text-2xl">{failedTransactions}</p>
            </div>
        </div>
    );
};

export default DashboardStats;
