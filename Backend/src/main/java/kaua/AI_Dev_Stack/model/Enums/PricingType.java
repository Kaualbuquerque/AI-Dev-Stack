package kaua.AI_Dev_Stack.model.Enums;

import lombok.Getter;

@Getter
public enum PricingType {
    FREE("Gratuito"),
    FREEMIUM("Freemium"),
    PAID("Pago");

    private final String displayValue;

    PricingType(String displayValue){
        this.displayValue = displayValue;
    }

}
