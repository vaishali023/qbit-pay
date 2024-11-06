Transactions = Transactions or {}

function CreateTransaction(msg)
    local qbitId = msg.Tags['QBit-Id']
    local amount = msg.Tags['Amount']
    local tokenPID = msg.Tags['Token-PID']
    local recipient = msg.Tags['Recipient']
    local sender = msg.From
    local transferTxn = msg.Tags['Transfer-Txn']

    assert(qbitId, 'QBit-Id is required')
    assert(amount, 'Amount is required')
    assert(tokenPID, 'Token-PID is required')
    assert(recipient, 'Recipient is required')
    assert(transferTxn, 'Transfer-Txn is required')

    local transaction = {
        qbitId = qbitId,
        amount = amount,
        tokenPID = tokenPID,
        recipient = recipient,
        sender = sender,
        transferTxn = transferTxn
    }

    Transactions[qbitId] = transaction

    msg.reply({ Action = 'Transaction-Created', Transaction = transaction })
end

function GetTransaction(msg)
    local qbitId = msg.Tags['QBit-Id']
    local transaction = Transactions[qbitId]

    msg.reply({ Action = 'Transaction-Retrieved', Data = json.encode(transaction) })
end

function GetAllTransactions(msg)
    msg.reply({ Action = 'All-Transactions-Retrieved', Data = json.encode(Transactions) })
end

Handlers.add('Create-Transaction', {Action = 'Create-Transaction'}, CreateTransaction)
Handlers.add('Get-Transaction', {Action = 'Get-Transaction'}, GetTransaction)
Handlers.add('Get-All-Transactions', {Action = 'Get-All-Transactions'}, GetAllTransactions)