// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view } from 'near-sdk-js';

@NearBindgen({})
class DonacionesContract {
  // Definir el esquema de los datos que se van a almacenar
  static schema = {
    remitente: 'string',
    nombre: 'string',
    monto: 'string',
    fecha: 'string',
    organizacion: 'string',
  };

  // Estado inicial
  donaciones: Array<{ remitente: string; nombre: string; monto: string; fecha: string; organizacion: string }> = [];

  // Método para obtener todas las donaciones (método de lectura)
  @view({})
  get_donaciones(): Array<{ remitente: string; nombre: string; monto: string; fecha: string; organizacion: string }> {
    return this.donaciones;
  }

  // Método para agregar una nueva donación (método de escritura)
  @call({})
  agregar_donacion({ nombre, monto, organizacion }: { nombre: string; monto: string; organizacion: string }): void {
    const remitente = near.signerAccountId(); // Obtiene la cuenta del remitente

    // Obtener la fecha actual automáticamente
    const fechaActual = new Date().toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'

    near.log(Agregando donación de ${remitente} (${nombre}) por un monto de ${monto});

    // Agregar la nueva donación al estado
    this.donaciones.push({
      remitente,
      nombre,
      monto,
      fecha: fechaActual,
      organizacion,
    });

    near.log(Donación agregada exitosamente);
  }

  // Método para obtener una donación específica por el índice
  @view({})
  get_donacion_por_indice({ indice }: { indice: number }): { remitente: string; nombre: string; monto: string; fecha: string; organizacion: string } | null {
    if (indice >= 0 && indice < this.donaciones.length) {
      return this.donaciones[indice];
    } else {
      return null; // Retornar null si el índice está fuera de rango
    }
  }
}
