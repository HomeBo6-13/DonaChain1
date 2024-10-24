const nearConfig = {
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
};

const { connect, keyStores, WalletConnection } = nearApi;

async function initContract() {
    const near = await connect({ ...nearConfig, keyStore: new keyStores.BrowserLocalStorageKeyStore() });
    const wallet = new WalletConnection(near);
    const contract = await new nearApi.Contract(wallet.account(), 'test-account', {
        viewMethods: ['get_donaciones', 'get_donacion_por_indice'],
        changeMethods: ['agregar_donacion'],
    });

    return { wallet, contract };
}

async function displayDonations(contract) {
    const donaciones = await contract.get_donaciones();
    const donationList = document.getElementById('donationList');
    donationList.innerHTML = ''; // Limpiar la lista

    donaciones.forEach(donacion => {
        const li = document.createElement('li');
        li.textContent = `${donacion.fecha}: ${donacion.monto} - ${donacion.organizacion}`;
        donationList.appendChild(li);
    });
}

document.getElementById('donationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const { contract, wallet } = await initContract();

    await contract.agregar_donacion({
        monto: document.getElementById('monto').value,
        fecha: document.getElementById('fecha').value,
        organizacion: document.getElementById('organizacion').value,
    });

    document.getElementById('donationForm').reset();
    displayDonations(contract);
});

// Inicializar el contrato y mostrar donaciones
initContract().then(({ contract }) => {
    displayDonations(contract);
});
