package kaua.AI_Dev_Stack.model.Enums;

import lombok.Getter;

@Getter
public enum ToolType {
    CLI("cli"),
    WEB("web "),
    VSCODE("vscode"),
    JETBRAINS("jetbrains"),
    API("api"),
    DESKTOP("desktop");

    private final String label;

    ToolType(String label) {
        this.label = label;
    }
}
