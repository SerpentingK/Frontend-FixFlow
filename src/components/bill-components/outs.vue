<template>
    <section class="out-container">
        <form @submit.prevent="">
            <div class="input-container">
                <span>Razon: </span>
                <input type="text" placeholder="Ej: Almuerzo" required/>
            </div>
            <div class="input-container">
                <span>Salida:</span>
                <input type="number" required/>
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
@media (min-width: 1024px) {
    .out-container{
        width: 70%;
    }
}
</style>