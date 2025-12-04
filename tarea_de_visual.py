

saldo = 25000.75

while True:
    print("\n===Cajero Automatico=====")
    print("1. Consultar saldo")
    print("2: Retirar Dinero")
    print("3:Depositar Dinero ")
    print("4:Salir ")

    opcion = input("Selecione una opcion Del (1 al 4):")

    if opcion =="1":
        print(f"\n Su saldo actual es: $¨{saldo:.2f}")

    elif opcion == "2":
        try:
            monto = float(input("Ingrese la Cantidad A Retirar"))

        
 