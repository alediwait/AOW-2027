import React from "react";
import useGameStore from "../store";

// Inyecta `account` e `initsLoaded` como props en componentes de clase,
// suscribiéndolos al store de Zustand (reemplazo de react-redux `connect`).
export default function withGameStore(Component) {
    function Wrapped(props) {
        const account = useGameStore(state => state.account);
        const initsLoaded = useGameStore(state => state.initsLoaded);

        return <Component {...props} account={account} initsLoaded={initsLoaded} />;
    }

    const name = Component.displayName || Component.name || "Component";
    Wrapped.displayName = `withGameStore(${name})`;

    return Wrapped;
}
