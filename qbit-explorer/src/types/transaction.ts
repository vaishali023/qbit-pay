export interface Transaction {
    id: string;
    amount: number;
    recipient: string;
    timestamp: string;
    status: 'completed' | 'pending';
}

export interface QbitTransaction {
    tokenPID: string;
    recipient: string; 
    transferTxn: string;
    amount: string;
    sender: string;
    qbitId: string;
}

