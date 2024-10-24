import anyTest from 'ava';
import { Near, keyStores, utils } from 'near-api-js'; // Importar NEAR API
import { setDefaultResultOrder } from 'dns';
setDefaultResultOrder('ipv4first'); // temp fix for node >v17

const test = anyTest;

test.beforeEach(async (t) => {
  // Configurar la conexión a TestNet usando near-api-js
  const keyStore = new keyStores.InMemoryKeyStore();
  const near = await new Near({
    networkId: 'testnet',
    keyStore,
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org',
  });

  // Crear la cuenta de contrato en TestNet
  const root = await near.account('test-account.testnet');
  const contract = await root.createSubAccount('test-account', {
    initialBalance: utils.format.parseNearAmount('10'), // Fondo inicial para las pruebas
  });

  // Implementar el contrato .wasm
  await contract.deployContract('contrato_donaciones.wasm');

  t.context.accounts = { root, contract };
});

test('debe agregar una nueva donación', async (t) => {
  const { contract } = t.context.accounts;

  // Llamar al método agregar_donacion
  await contract.functionCall({
    contractId: contract.accountId,
    methodName: 'agregar_donacion',
    args: {
      monto: '300',
      fecha: '2024-10-24',
      organizacion: 'Cruz Roja',
    },
    gas: '300000000000000', // Gas para la transacción
    attachedDeposit: utils.format.parseNearAmount('1'), // El depósito que envías, si es necesario
  });

  // Verificar que la donación fue registrada
  const donaciones = await contract.viewFunction('get_donaciones', {});
  t.is(donaciones.length, 1); // Comprobar que hay una donación en el estado
  t.deepEqual(donaciones[0], {
    remitente: contract.accountId,
    monto: '300',
    fecha: '2024-10-24',
    organizacion: 'Cruz Roja',
  });
});
