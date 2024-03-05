# EVM Auto Sender

typescript library to sending eth amount to random address or specific list address
![alt example](https://i.imgur.com/9xY9AfJ_d.webp?maxwidth=760&fidelity=grand)
## Installation

Use the package manager npm to install foobar.

```bash
npm install evm-auto-sender
```

## Usage

```typescript
import AutoSender from "evm-auto-sender";

const client = new AutoSender({
    privateKey: "xxxxxxxxx",
    rpc: "https://rpc.ankr.com/eth_goerli",
    randomTarget: true,
  });
client.start();
```