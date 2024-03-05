import { Spinner } from "ora";

export const arrowSpinner: Spinner = {
    interval: 80,
    frames: [
        "[>        ]",
        "[=>       ]",
        "[==>      ]",
        "[===>     ]",
        "[====>    ]",
        "[=====>   ]",
        "[======>  ]",
        "[=======> ]",
        "[========>]",
        "[ ========]",
        "[  =======]",
        "[   ======]",
        "[    =====]",
        "[     ====]",
        "[      ===]",
        "[       ==]",
        "[        =]",
        "[         ]"
    ]
}