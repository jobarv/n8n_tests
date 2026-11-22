import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : MotionTech Gold Bot - Bybit Demo & Lambda (Isidro)
// Nodes   : 8  |  Connections: 8
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Schedule15m                        scheduleTrigger
// RouteLambdaResponse                switch
// TelegramTradeExecuted              telegram                   [creds]
// TelegramErrorAlert                 telegram                   [creds]
// InvokeAwsLambdaExecute             httpRequest                [onError→out(1)]
// TelegramSkipped                    telegram                   [creds]
// TelegramFallbackNoSignal           telegram                   [creds]
// If_                                if
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Schedule15m
//    → InvokeAwsLambdaExecute
//      → RouteLambdaResponse
//        → TelegramTradeExecuted
//       .out(1) → TelegramSkipped
//       .out(2) → TelegramErrorAlert
//       .out(3) → If_
//          → TelegramFallbackNoSignal
//     .out(1) → TelegramErrorAlert (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'nbYGpYwVPlccdTeZ',
    name: 'MotionTech Gold Bot - Bybit Demo & Lambda (Isidro)',
    active: true,
    isArchived: false,
    projectId: 'lwii3lg4a1iYi7ZC',
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: true },
})
export class MotiontechGoldBotBybitDemoLambdaIsidroWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '1e3a06c0-4a51-4558-8a2f-83d6984c8d71',
        name: 'Schedule 15m',
        type: 'n8n-nodes-base.scheduleTrigger',
        version: 1.2,
        position: [-848, 304],
    })
    Schedule15m = {
        rule: {
            interval: [
                {
                    field: 'cronExpression',
                    expression: '1,16,31,46 3-6,9-12 * * 1-5',
                },
            ],
        },
    };

    @node({
        id: '82c420b2-eb63-48b2-80b0-1a6d61570180',
        name: 'Route Lambda Response',
        type: 'n8n-nodes-base.switch',
        version: 3.2,
        position: [-416, 224],
    })
    RouteLambdaResponse = {
        rules: {
            values: [
                {
                    conditions: {
                        options: {
                            caseSensitive: true,
                            leftValue: '',
                            typeValidation: 'strict',
                            version: 2,
                        },
                        conditions: [
                            {
                                leftValue: '={{ $json.status }}',
                                rightValue: 'executed',
                                operator: {
                                    type: 'string',
                                    operation: 'equals',
                                },
                                id: '592d9b72-9f96-4c23-8e4e-e78329ad038c',
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'Executed',
                },
                {
                    conditions: {
                        options: {
                            caseSensitive: true,
                            leftValue: '',
                            typeValidation: 'strict',
                            version: 2,
                        },
                        conditions: [
                            {
                                leftValue: '={{ $json.status }}',
                                rightValue: 'skipped',
                                operator: {
                                    type: 'string',
                                    operation: 'equals',
                                },
                                id: 'e43be139-b0eb-45a5-9dce-dc83e6e8a040',
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'Skipped',
                },
                {
                    conditions: {
                        options: {
                            caseSensitive: true,
                            leftValue: '',
                            typeValidation: 'strict',
                            version: 2,
                        },
                        conditions: [
                            {
                                id: 'a2642d2e-36de-43b9-8246-bf25463a3ff5',
                                leftValue: '={{ $json.status }}',
                                rightValue: 'error',
                                operator: {
                                    type: 'string',
                                    operation: 'equals',
                                    name: 'filter.operator.equals',
                                },
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'error',
                },
            ],
        },
        options: {
            fallbackOutput: 'extra',
        },
    };

    @node({
        id: '7d3a020f-525d-4f4b-9c44-87a64e1873a0',
        webhookId: '3bbf8c1a-6ae1-4d7e-9015-097410b28470',
        name: 'Telegram: Trade Executed',
        type: 'n8n-nodes-base.telegram',
        version: 1.2,
        position: [-224, 48],
        credentials: { telegramApi: { id: 'u5p5w9WWCET2zbhZ', name: 'Telegram account' } },
    })
    TelegramTradeExecuted = {
        chatId: '1578652470',
        text: `=🚀 *ORDEN EJECUTADA ({{ $json.environment }})*

🪙 *Activo:* {{ $json.symbol }}
📊 *Dirección:* {{ $json.side }}
💵 *Entrada:* \${{ $json.entry_price }}
📦 *Contratos (Qty):* {{ $json.qty }}
🛡 *Stop Loss:* \${{ $json.sl }}
🎯 *Take Profit:* \${{ $json.tp }}
⚠️ *Riesgo:* \${{ $json.risk_usdt }} USDT

🆔 _Order ID:_ \`{{ $json.order_id }}\``,
        additionalFields: {
            parse_mode: 'Markdown',
        },
    };

    @node({
        id: 'b3a39c8e-b64f-466d-89bc-30f9b89f71ad',
        webhookId: 'ece4fbba-f08c-4e0b-869c-b0e3de5c7078',
        name: 'Telegram: Error Alert',
        type: 'n8n-nodes-base.telegram',
        version: 1.2,
        position: [-192, 480],
        credentials: { telegramApi: { id: 'u5p5w9WWCET2zbhZ', name: 'Telegram account' } },
    })
    TelegramErrorAlert = {
        chatId: '1578652470',
        text: `=🚨 *ERROR EN BOT DE TRADING*

❌ *Detalle:* {{ $json.error.message }}`,
        additionalFields: {
            parse_mode: 'Markdown',
        },
    };

    @node({
        id: '43006664-f919-4534-9ad6-49870c7bc711',
        name: 'Invoke AWS Lambda (Execute)',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [-624, 304],
        onError: 'continueErrorOutput',
        alwaysOutputData: false,
    })
    InvokeAwsLambdaExecute = {
        method: 'POST',
        url: 'https://vh3cywzmi9.execute-api.mx-central-1.amazonaws.com/default/ByBit_trading_bot',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'x-api-key',
                    value: 'mt_gold_bot_994812',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `{
  "symbol": "PAXG/USDT:USDT",
  "timeframe": "15m",
  "risk_pct": 1.0,
  "sl_points": 15.0,
  "rr_ratio": 2.0
}`,
        options: {},
    };

    @node({
        id: '4543d30c-9e3a-4ffb-9dfe-c485ce71610e',
        webhookId: '3bbf8c1a-6ae1-4d7e-9015-097410b28470',
        name: 'Telegram: Skipped',
        type: 'n8n-nodes-base.telegram',
        version: 1.2,
        position: [-128, 224],
        credentials: { telegramApi: { id: 'u5p5w9WWCET2zbhZ', name: 'Telegram account' } },
    })
    TelegramSkipped = {
        chatId: '1578652470',
        text: `=⏭ *SEÑAL OMITIDA (SKIPPED)*

🪙 *Activo:* {{ $json.symbol || 'PAXG/USDT:USDT' }}
ℹ️ *Motivo:* {{ $json.message }}
🕒 *Hora (UTC):* {{ $now.toUTC().toFormat('HH:mm') }}`,
        additionalFields: {
            parse_mode: 'Markdown',
        },
    };

    @node({
        id: '6e000209-c38f-461f-b902-fee66f3f9f6d',
        webhookId: '3bbf8c1a-6ae1-4d7e-9015-097410b28470',
        name: 'Telegram: Fallback / No Signal',
        type: 'n8n-nodes-base.telegram',
        version: 1.2,
        position: [176, 176],
        credentials: { telegramApi: { id: 'u5p5w9WWCET2zbhZ', name: 'Telegram account' } },
    })
    TelegramFallbackNoSignal = {
        chatId: '1578652470',
        text: `=🔍 *EVALUACIÓN SIN ENTRADA (NO SIGNAL)*

🪙 *Activo:* {{ $json.symbol || 'PAXG/USDT:USDT' }}
📌 *Estado:* \`{{ $json.status || 'unknown' }}\`
ℹ️ *Detalle:* {{ $json.reason || 'Sin cruce / fuera de condiciones' }}

📊 *Métricas de la Vela:*
• *Cierre:* {{ $json.last_close ? '$' + $json.last_close : 'N/A' }}
• *Rango (H / L):* {{ $json.range_high ? '$' + $json.range_high + ' / $' + $json.range_low : 'N/A' }}
• *Tendencia H1 / EMA50:* {{ $json.h1_trend || ($json.ema50 ? '$' + $json.ema50 : 'N/A') }}
• *Ratio Volumen:* {{ $json.vol_ratio ? $json.vol_ratio + 'x' : 'N/A' }}

🕒 *Hora (UTC):* {{ $json.utc_time || $now.toUTC().toFormat('HH:mm') }}`,
        additionalFields: {},
    };

    @node({
        id: 'acc72f3a-06a8-47ac-a792-eb42f2d83c42',
        name: 'If',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [-32, 368],
    })
    If_ = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    id: '4b5c87db-e219-4a2d-b73d-ea667f5df708',
                    leftValue:
                        "=Value 1: {{ $('Schedule 15m').item.json.Hour }}:{{ $('Schedule 15m').item.json.Minute }}",
                    rightValue: '03:31',
                    operator: {
                        type: 'string',
                        operation: 'equals',
                        name: 'filter.operator.equals',
                    },
                },
                {
                    id: 'dbd47cd8-c874-4e11-a3cc-0d9e7529fa12',
                    leftValue: "={{ $('Schedule 15m').item.json.Hour }}:{{ $('Schedule 15m').item.json.Minute }}",
                    rightValue: '10:01',
                    operator: {
                        type: 'string',
                        operation: 'equals',
                        name: 'filter.operator.equals',
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.Schedule15m.out(0).to(this.InvokeAwsLambdaExecute.in(0));
        this.RouteLambdaResponse.out(0).to(this.TelegramTradeExecuted.in(0));
        this.RouteLambdaResponse.out(1).to(this.TelegramSkipped.in(0));
        this.RouteLambdaResponse.out(2).to(this.TelegramErrorAlert.in(0));
        this.RouteLambdaResponse.out(3).to(this.If_.in(0));
        this.InvokeAwsLambdaExecute.out(0).to(this.RouteLambdaResponse.in(0));
        this.InvokeAwsLambdaExecute.out(1).to(this.TelegramErrorAlert.in(0));
        this.If_.out(0).to(this.TelegramFallbackNoSignal.in(0));
    }
}
