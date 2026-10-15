import React from "react";
import useGameStore from "../../store";

import MainContainer from "../../components/mainContainer/index";
import style from "./style.module.css";

import inits from "../../engine/inits";
import RenderCharacters from "../../engine/renderCharacters";

import { fetchUrl, routerPush } from "../../config/utils";
import withGameStore from "../../components/withGameStore";
import {
    clases,
    razas,
    generos,
    nameClases,
    nameGeneros,
    nameRazas
} from "../../config/config";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

class CreateCharacter extends React.Component {
    static async getInitialProps({ req, res }) {
        const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;

        return { userAgent };
    }

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            idClaseSelected: 1,
            idRazaSelected: 1,
            idGeneroSelected: 1,
            idHeadSelected: 1,
            character: {
                idBody: 1,
                idHead: 1,
                idWeapon: 48,
                idShield: 0,
                idHelmet: 0,
                idGenero: 1
            },
            nameClase: nameClases[1],
            nameRaza: nameRazas[1],
            nameGenero: nameGeneros[1]
        };

        this.canvas = {};
    }

    handleInput = e => {
        this.setState({ name: e.target.value });
    };

    handleCreate = async () => {
        const { name, idClaseSelected, idRazaSelected, idGeneroSelected, idHeadSelected } = this.state;

        if (!name || !name.trim()) {
            return alert("Ingresá un nombre para tu personaje.");
        }

        const body = {
            name: name.trim(),
            idClase: idClaseSelected,
            idRaza: idRazaSelected,
            idGenero: idGeneroSelected,
            idHead: idHeadSelected
        };

        const result = await fetchUrl("/character", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        if (!result || result.error) {
            return alert((result && result.message) || "No se pudo crear el personaje.");
        }

        routerPush("/");
    };

    componentDidMount() {
        const { initsLoaded } = this.props;

        this.canvas.ctx = this.canvas.getContext("2d");

        if (initsLoaded) this.drawChar();
    }

    drawChar = () => {
        const { initsLoaded } = this.props;
        const { character } = this.state;

        if (initsLoaded && this.canvas.ctx) {
            const rndChar = new RenderCharacters(
                inits,
                this.canvas.ctx,
                character,
                24,
                60
            );
            rndChar.drawChar();
        }
    };

    // Rangos de cabezas [primera, última] por "raza-genero".
    // Verificados contra public/static/init/heads.json (todos contiguos y válidos).
    getHeadRange = (idRaza, idGenero) => {
        const ranges = {
            "1-1": [1, 40], "1-2": [71, 89],
            "2-1": [101, 122], "2-2": [171, 188],
            "3-1": [201, 221], "3-2": [271, 288],
            "4-1": [301, 319], "4-2": [371, 385],
            "5-1": [401, 416], "5-2": [471, 486]
        };

        return ranges[`${idRaza}-${idGenero}`] || [1, 40];
    };

    firstHeadOf = (idRaza, idGenero) => this.getHeadRange(idRaza, idGenero)[0];

    prevHead = async () => {
        let { idRazaSelected, idGeneroSelected, idHeadSelected, character } = this.state;

        const [first] = this.getHeadRange(idRazaSelected, idGeneroSelected);

        if (idHeadSelected > first) {
            idHeadSelected--;
        }

        character.idHead = idHeadSelected;

        await this.setState({
            character: character,
            idHeadSelected: idHeadSelected
        });

        this.drawChar();
    };

    nextHead = async () => {
        let { idRazaSelected, idGeneroSelected, idHeadSelected, character } = this.state;

        const [, last] = this.getHeadRange(idRazaSelected, idGeneroSelected);

        if (idHeadSelected < last) {
            idHeadSelected++;
        }

        character.idHead = idHeadSelected;

        await this.setState({
            character: character,
            idHeadSelected: idHeadSelected
        });

        this.drawChar();
    };

    prevClase = async () => {
        let { idClaseSelected, character } = this.state;

        if (idClaseSelected > 1) {
            idClaseSelected--;
            if (idClaseSelected == 5) {
                idClaseSelected--;
            }

            if (idClaseSelected == clases.cazador) {
                character.idWeapon = 40;
            } else {
                character.idWeapon = 48;
            }

            await this.setState({
                character: character,
                idClaseSelected: idClaseSelected,
                nameClase: nameClases[idClaseSelected]
            });

            this.drawChar();
        }
    };

    nextClase = async () => {
        let { idClaseSelected, character } = this.state;

        if (idClaseSelected < 9) {
            idClaseSelected++;
            if (idClaseSelected == 5) {
                idClaseSelected++;
            }

            if (idClaseSelected == clases.cazador) {
                character.idWeapon = 40;
            } else {
                character.idWeapon = 48;
            }

            await this.setState({
                character: character,
                idClaseSelected: idClaseSelected,
                nameClase: nameClases[idClaseSelected]
            });

            this.drawChar();
        }
    };

    prevRaza = async () => {
        let { idRazaSelected, idGeneroSelected, idHeadSelected, character } = this.state;

        if (idRazaSelected > 1) {
            idRazaSelected--;

            if (idRazaSelected == razas.humano) {
                character.idBody = 1;
            } else if (idRazaSelected == razas.elfo) {
                character.idBody = 2;
            } else if (idRazaSelected == razas.elfoDrow) {
                character.idBody = 3;
            } else if (idRazaSelected == razas.enano) {
                character.idBody = 300;
            } else if (idRazaSelected == razas.gnomo) {
                character.idBody = 300;
            }

            idHeadSelected = this.firstHeadOf(idRazaSelected, idGeneroSelected);

            character.idHead = idHeadSelected;

            await this.setState({
                character: character,
                idHeadSelected: idHeadSelected,
                nameRaza: nameRazas[idRazaSelected],
                idRazaSelected: idRazaSelected
            });

            this.drawChar();
        }
    };

    nextRaza = async () => {
        let { idRazaSelected, idGeneroSelected, idHeadSelected, character } = this.state;

        if (idRazaSelected < 5) {
            idRazaSelected++;

            if (idRazaSelected == razas.humano) {
                character.idBody = 1;
            } else if (idRazaSelected == razas.elfo) {
                character.idBody = 2;
            } else if (idRazaSelected == razas.elfoDrow) {
                character.idBody = 3;
            } else if (idRazaSelected == razas.enano) {
                character.idBody = 300;
            } else if (idRazaSelected == razas.gnomo) {
                character.idBody = 300;
            }

            idHeadSelected = this.firstHeadOf(idRazaSelected, idGeneroSelected);

            character.idHead = idHeadSelected;

            await this.setState({
                character: character,
                idHeadSelected: idHeadSelected,
                nameRaza: nameRazas[idRazaSelected],
                idRazaSelected: idRazaSelected
            });

            this.drawChar();
        }
    };

    prevGenero = async () => {
        let { idRazaSelected, idGeneroSelected, idHeadSelected, character } = this.state;

        if (idGeneroSelected > 1) {
            idGeneroSelected--;

            character.idGenero = idGeneroSelected;

            idHeadSelected = this.firstHeadOf(idRazaSelected, idGeneroSelected);
            character.idHead = idHeadSelected;

            await this.setState({
                character: character,
                idHeadSelected: idHeadSelected,
                idGeneroSelected: idGeneroSelected,
                nameGenero: nameGeneros[idGeneroSelected]
            });

            this.drawChar();
        }
    };

    nextGenero = async () => {
        let { idRazaSelected, idGeneroSelected, idHeadSelected, character } = this.state;

        if (idGeneroSelected < 2) {
            idGeneroSelected++;

            character.idGenero = idGeneroSelected;

            idHeadSelected = this.firstHeadOf(idRazaSelected, idGeneroSelected);
            character.idHead = idHeadSelected;

            await this.setState({
                character: character,
                idHeadSelected: idHeadSelected,
                idGeneroSelected: idGeneroSelected,
                nameGenero: nameGeneros[idGeneroSelected]
            });

            this.drawChar();
        }
    };

    render() {
        const { initsLoaded, userAgent } = this.props;
        const { nameClase, nameRaza, nameGenero } = this.state;

        if (typeof window !== "undefined" && initsLoaded) this.drawChar();

        return (
            <MainContainer userAgent={userAgent}>
                <div className={style.contentLeft}>
                    <div className={style.shadow}>
                        <h4>Crear Personaje</h4>

                        <div className={style.createCharacter}>
                            <div className={style.content_general}>
                                <div className={style.content_left}>
                                    <label
                                        htmlFor="name"
                                        className={style.text}
                                    >
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        className={style.input_text}
                                        id="name"
                                        value={this.state.name}
                                        onChange={this.handleInput}
                                    />
                                    <div className={style.canvasCharacter}>
                                        <FontAwesomeIcon
                                            icon={faAngleLeft}
                                            className={style.faAngleLeft}
                                            onClick={this.prevHead}
                                        />
                                        <canvas
                                            ref={ref => {
                                                this.canvas = ref;
                                            }}
                                            className={style.character}
                                            width="80"
                                            height="100"
                                        />
                                        <FontAwesomeIcon
                                            icon={faAngleRight}
                                            className={style.faAngleRight}
                                            onClick={this.nextHead}
                                        />
                                    </div>
                                </div>
                                <div className={style.content_right}>
                                    <label
                                        htmlFor="name"
                                        className={style.text}
                                    >
                                        Clase
                                    </label>

                                    <div className={style.content_input_text}>
                                        <FontAwesomeIcon
                                            icon={faAngleLeft}
                                            className={style.faAngleLeft}
                                            onClick={this.prevClase}
                                        />
                                        <input
                                            type="text"
                                            className={style.input_text}
                                            id="clase"
                                            value={nameClase}
                                            readOnly
                                        />
                                        <FontAwesomeIcon
                                            icon={faAngleRight}
                                            className={style.faAngleRight}
                                            onClick={this.nextClase}
                                        />
                                    </div>

                                    <label
                                        htmlFor="name"
                                        className={style.text}
                                    >
                                        Raza
                                    </label>

                                    <div className={style.content_input_text}>
                                        <FontAwesomeIcon
                                            icon={faAngleLeft}
                                            className={style.faAngleLeft}
                                            onClick={this.prevRaza}
                                        />
                                        <input
                                            type="text"
                                            className={style.input_text}
                                            id="raza"
                                            value={nameRaza}
                                            readOnly
                                        />
                                        <FontAwesomeIcon
                                            icon={faAngleRight}
                                            className={style.faAngleRight}
                                            onClick={this.nextRaza}
                                        />
                                    </div>

                                    <label
                                        htmlFor="name"
                                        className={style.text}
                                    >
                                        Género
                                    </label>

                                    <div className={style.content_input_text}>
                                        <FontAwesomeIcon
                                            icon={faAngleLeft}
                                            className={style.faAngleLeft}
                                            onClick={this.prevGenero}
                                        />
                                        <input
                                            type="text"
                                            className={style.input_text}
                                            id="genero"
                                            value={nameGenero}
                                            readOnly
                                        />
                                        <FontAwesomeIcon
                                            icon={faAngleRight}
                                            className={style.faAngleRight}
                                            onClick={this.nextGenero}
                                        />
                                    </div>

                                    <label
                                        htmlFor="name"
                                        className={style.text}
                                    >
                                        Ciudad
                                    </label>

                                    <div
                                        className={`${style.content_input_text} ${style.margin_left}`}
                                    >
                                        <input
                                            type="text"
                                            className={style.input_text}
                                            id="ciudad"
                                            value="Ullathorpe"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>

                            <button onClick={this.handleCreate}>Crear personaje</button>
                        </div>
                    </div>
                </div>
            </MainContainer>
        );
    }
}

export default withGameStore(CreateCharacter);
