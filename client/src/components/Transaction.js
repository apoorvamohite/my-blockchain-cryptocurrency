import React, { Component } from 'react';

const Transaction = ({ transaction }) => {
    const { input, outputMap } = transaction;
    const recipients = Object.keys(outputMap);

    return(
        <div>
            <div>
                From: {`${input.address.substring(0,10)}...${input.address.substring(input.address.length - 10)}`} | Balance: ${input.amount}
            </div>
            {
                recipients.map(recipient => {
                    return(
                    <div key={recipient}>
                        To: {`${recipient.substring(0,10)}...${recipient.substring(recipient.length - 10)}`} | Sent: {outputMap[recipient]}
                    </div>
                    );
                })
            }
        </div>
    );
}

export default Transaction;