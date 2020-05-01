import React, { Component } from 'react';
import Transaction from './Transaction';
import { Button } from 'react-bootstrap';

class Block extends Component {

    state = { displayTransaction: false };

    toggleTransaction = () => {
        this.setState({ displayTransaction: !this.state.displayTransaction });
    };

    get displayTransaction() {
        const { data } = this.props.block;
        const stringifiedData = JSON.stringify(data);
        const dataDisplay = stringifiedData.length > 35 ? `${stringifiedData.substring(0, 35)}...` : stringifiedData;

        if (this.state.displayTransaction) {
            return (
                <div>
                    {
                        data.map(transaction=>{
                            return(
                                <div key={transaction.id} className="Transaction">
                                    <hr/>
                                    <Transaction transaction={transaction}/>
                                </div>
                            );
                        })
                    }
                    <br />
                    <Button
                        variant="danger"
                        size="small"
                        onClick={this.toggleTransaction}>
                        Show Less
                </Button>
                </div>
            );
        }

        return (
            <div>
                Data: {dataDisplay}
                <br />
                <Button
                    variant="danger"
                    size="small"
                    onClick={this.toggleTransaction}>
                    Show More
            </Button>
            </div>
        );
    }

    render() {
        const { timestamp, hash } = this.props.block;

        const hashDisplay = `${hash.substring(0, 15)}...`;

        return (
            <div className="Block">
                <div>Hash: {hashDisplay}</div>
                <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
                {this.displayTransaction}
            </div>
        );
    }
}

export default Block;