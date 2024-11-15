<template>
    <section class="out-container">
        <form @submit.prevent="">
            <div class="input-container">
                <span>Producto: </span>
                <input type="text" placeholder="Ej: Airpods Pro" required/>
            </div>
            <div class="input-container">
                <span>Venta:</span>
                <input type="number" placeholder="100000" required/>
            </div>
            <div class="input-container">
                <span>Codigo:</span>
                <input type="number" placeholder="30000" required/>
            </div>
            <div class="info-container">
                <span>Ganancia:</span>
                <span>70000</span>
            </div>
            <button class="confirm-btn">Confirmar</button>
        </form>
    </section>
</template>

<style scoped>
.out-container{
    margin-top: 30px;
    width: 100%;
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: column;
    max-height: 400px;
    overflow-y: scroll;
    scrollbar-width: none;
}
.out-container form{
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}
.input-container{
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    padding: 5px 10px;
    border-radius: 5px;
}
.input-container input{
    all: unset;
    width: 60%;
}
input::-webkit-outer-spin-button, input::-webkit-inner-spin-button{
    display: none;
}
.info-container{
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    color: var(--secGray);
}
.confirm-btn{
    background-color: transparent;
    border: 2px solid var(--baseOrange);
    padding: 5px 10px;
    color: white;
    text-transform: uppercase;
    border-radius: 5px;
    letter-spacing: 1px;
    cursor: pointer;
    transition: .3s;
}
.confirm-btn:active{
    scale: .9;
}
</style>