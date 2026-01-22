import SignClient from "https://esm.sh/@walletconnect/sign-client";
import QRCode from "https://esm.sh/qrcode";

const connectBtn = document.getElementById("connectBtn");
const info = document.getElementById("info");

let client;

async function init() {
  client = await SignClient.init({
    projectId: "2b1ad989ef1afde58868b14c43eb18f4",
    metadata: {
      name: "WalletConnect Activity Viewer",
      description: "Demo project using WalletConnect",
      url: "http://localhost",
      icons: []
    }
  });
}

connectBtn.onclick = async () => {
  info.innerHTML = "<p>Waiting for wallet connection...</p>";

  const { uri, approval } = await client.connect({
    requiredNamespaces: {
      eip155: {
        methods: ["eth_sendTransaction"],
        chains: ["eip155:1"],
        events: ["accountsChanged"]
      }
    }
  });

  if (uri) {
    const canvas = document.createElement("canvas");
    info.innerHTML = "<p>Scan QR with your wallet</p>";
    info.appendChild(canvas);

    QRCode.toCanvas(canvas, uri);
  }

  const session = await approval();
  const account = session.namespaces.eip155.accounts[0];

  info.innerHTML = `
    <h3>Connected ✅</h3>
    <p><strong>Account:</strong> ${account}</p>
    <p><strong>Chain:</strong> Ethereum</p>
  `;
};

init();