import { animaisData } from "./animais";
import { recintosData } from "./recintos";

class RecintosZoo {

    analisaRecintos(animalNome, quantidade) {

        function buscarAnimalNaBasePeloNome(nome) {
            return animaisData.find(animal => animal.nome === nome.toUpperCase())
        }

        const animalDigitado = buscarAnimalNaBasePeloNome(animalNome)

        if (!animalDigitado) {
            return { erro: "Animal inválido" };
        }

        if (!quantidade || quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        function calcularTamanhoOcupado(animal, quantidade) {
            return (animal.tamanho * quantidade)
        }

        function biomasAdequados(animalNome, quantidade) {
            let recintosAdequados = []
            recintosData.forEach(recinto => {

                for (let i = 0; i < recinto.biomas.length; i++) {
                    let bioma = recinto.biomas[i];
                    if (animalDigitado.biomas.includes(bioma)) {
                        recintosAdequados.push(recinto);
                        break;
                    }
                }

            })

            return recintosAdequados

        }

        function espacosDevidoEspeciesDiferentes(recinto) {
            return recinto.ocupantes.reduce((count, ocupante) => {
                if (ocupante.nome !== animalDigitado.nome) {
                    count += 1;
                }
                return count;
            }, 0);
        }

        function espacoLivreNoRecintoDepoisDeAdicionarAnimal(recinto, animal) {

            let tamanhoQueRestaAoPreencher = recinto.tamanhoTotal - espacosDevidoEspeciesDiferentes(recinto)
            let ocupantesDoRecinto = recinto.ocupantes
            if (ocupantesDoRecinto.length > 0) {
                ocupantesDoRecinto.forEach(ocupante => {
                    tamanhoQueRestaAoPreencher = tamanhoQueRestaAoPreencher - calcularTamanhoOcupado(buscarAnimalNaBasePeloNome(ocupante.nome), ocupante.quantidade)
                })
            }

            return tamanhoQueRestaAoPreencher - calcularTamanhoOcupado(animal, quantidade);
        }

        function filtrarEspacosSuficientes(listaRecintosAdequados) {
            let recintosFiltrado = []

            listaRecintosAdequados.forEach(r => {

                let tamanhoTotalRecinto = espacoLivreNoRecintoDepoisDeAdicionarAnimal(r, animalDigitado)

                if (tamanhoTotalRecinto >= 0) {
                    recintosFiltrado.push(r)
                }
            })

            return recintosFiltrado
        }


        function filtrarSeCarnivoros(listaRecintosAdequados) {
            let recintosFiltrado = []

            if (animalDigitado.isCarnivoro) {
                listaRecintosAdequados.forEach(r => {

                    let ocupantesDoRecinto = r.ocupantes
                    if (ocupantesDoRecinto.length > 0) {
                        for (let i = 0; i < ocupantesDoRecinto.length; i++) {
                            if (ocupantesDoRecinto[i].nome === animalDigitado.nome) {
                                recintosFiltrado.push(r)
                                break
                            }
                        }
                    } else {
                        recintosFiltrado.push(r)
                    }
                })
                return recintosFiltrado
            } else {
                listaRecintosAdequados.forEach(r => {
                    let ocupantesDoRecinto = r.ocupantes
                    if (ocupantesDoRecinto.length > 0) {
                        for (let i = 0; i < ocupantesDoRecinto.length; i++) {

                            let animalNoRecinto = buscarAnimalNaBasePeloNome(ocupantesDoRecinto[i].nome)

                            if (!animalNoRecinto.isCarnivoro) {
                                recintosFiltrado.push(r)
                                break
                            }
                        }
                    } else {
                        recintosFiltrado.push(r)
                    }
                })
                return recintosFiltrado
            }
        }

        let listaRecintosAdequados = biomasAdequados(animalNome, quantidade)
        listaRecintosAdequados = filtrarEspacosSuficientes(listaRecintosAdequados)
        listaRecintosAdequados = filtrarSeCarnivoros(listaRecintosAdequados)


        function filtroHipopotamo(listaRecintosAdequados) {
            let recintosFiltrado = [];

            listaRecintosAdequados.forEach(r => {
                let deveSeguirRegraEspecifica = false

                if (r.ocupantes.length > 0) {
                    let ocupantes = r.ocupantes
                    ocupantes.forEach(ocupante => {
                        if (ocupante.nome != animalDigitado.nome)
                            deveSeguirRegraEspecifica = true
                    })

                    if (deveSeguirRegraEspecifica) {
                        if (r.biomas.includes('savana') && r.biomas.includes('rio')) {
                            recintosFiltrado.push(r);
                        }
                    } else {
                        recintosFiltrado.push(r)
                    }
                } else {
                    recintosFiltrado.push(r)
                }


            });

            return recintosFiltrado;
        }


        //regra hipopotamo
        if (animalDigitado.nome === "HIPOPOTAMO") {
            listaRecintosAdequados = filtroHipopotamo(listaRecintosAdequados)
        }



        function possoAdicionarAnimalComHipopotamo(recinto) {
            let temHipopotamo = false;

            recinto.ocupantes.forEach(ocupante => {
                if (ocupante.nome === "HIPOPOTAMO") {
                    temHipopotamo = true
                }
            })

            if (temHipopotamo) {
                return (recinto.biomas.includes('savana') && recinto.biomas.includes('rio'))
            }
            return true
        }


        function filtroMacaco(listaRecintosAdequados) {
            let recintosFiltrado = []

            listaRecintosAdequados.forEach(r => {
                if (quantidade < 2) {
                    if (r.ocupantes.length >= 1 && possoAdicionarAnimalComHipopotamo(r)) {
                        recintosFiltrado.push(r)
                    }
                } else {
                    if (possoAdicionarAnimalComHipopotamo(r)) {
                        recintosFiltrado.push(r)
                    }
                }
            })

            return recintosFiltrado

        }

        //regra macaco
        if (animalDigitado.nome === "MACACO") {
            listaRecintosAdequados = filtroMacaco(listaRecintosAdequados)
        }

        const recintosViaveis = [];

        listaRecintosAdequados.forEach(r => {
            recintosViaveis.push({
                recinto: r.id,
                espacoLivre: espacoLivreNoRecintoDepoisDeAdicionarAnimal(r, animalDigitado),
                espacoTotal: r.tamanhoTotal
            })
        })

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        recintosViaveis.sort((a, b) => a.recinto - b.recinto);

        return {
            recintosViaveis: recintosViaveis.map(r => `Recinto ${r.recinto} (espaço livre: ${r.espacoLivre} total: ${r.espacoTotal})`)
        };
    }

}

export { RecintosZoo as RecintosZoo };
