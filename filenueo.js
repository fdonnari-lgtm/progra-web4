function semana (n){
    switch (n) {
        case 1:
            return "lunes" ;
        case 2 :
            return "martes" ;
        case 3:
            return "miercoles" ;
        case 4 :
            return "jueves" ;
        case 5:
            return "viernes" ;
        case 6 :
            return "sabado" ;
        case 7:
            return "domingo" ;
        default:
            return "numero invalido";
        }
}


console.log(semana(2))
console.log(semana(3))
    
