import axios from "axios";

const site = process.env.SITE?.trim() || '';

export async function criarPix(body: any){
    return await axios.post(`${site.replace(/\/$/, '')}/api/pagamento/`, body);
}

export async function verPagamento(number: any) {
    return await axios.get(`${site.replace(/\/$/, '')}/api/pagamento/`, { params: { number } })
      //.then(response => console.log("PAGAMENTO: ",response.data.data.status))
      .then(response => response.data.data.status)
      .catch(error => console.log(error));
}
