saldo = 10000

while True:
    print("\nCAJERO AUTOMÁTICO")
    print("1. Consultar Saldo")
    print("2. Retirar Dinero")
    print("3. Depositar Dinero")
    print("4. Salir")
    
    opcion = input("Seleccione una opción (1-4): ")

    if opcion == "1":
        print(f"\n Su saldo actual es: ${saldo:.2f}")
    
    elif opcion == "2":
        try:
            monto = float(input("Ingrese la cantidad a retirar: "))
            if monto <= 0:
                print("El monto debe ser mayor que cero.")
            elif monto > saldo:
                print("Fondos insuficientes.")
            else:
                saldo -= monto
                print(f"Retiro exitoso. Su nuevo saldo es: ${saldo:.2f}")
        except ValueError:
            print(" Entrada no válida. Debe ingresar un número.")
    
    elif opcion == "3":
        try:
            monto = float(input("Ingrese la cantidad a depositar: "))
            if monto <= 0:
                print(" El monto debe ser mayor que cero.")
            else:
                saldo += monto
                print(f" Depósito exitoso. Su nuevo saldo es: ${saldo:.2f}")
        except ValueError:
            print(" Debe ingresar un número.")
    
    elif opcion == "4":
        print("\n Hasta pronto. ")
        break
    
    else:
        print("Elija una opción del 1 al 4.")
