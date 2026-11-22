import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Ejemplo 2 - Calculadora e Impuestos
// Nodes   : 3  |  Connections: 2
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// WebhookEntrante                    webhook
// CalcularIvaYTotal                  code
// ResponderHttp200                   respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// WebhookEntrante
//    → CalcularIvaYTotal
//      → ResponderHttp200
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'xKwE0S5s9HCkVCNc',
    name: 'Ejemplo 2 - Calculadora e Impuestos',
    active: false,
    isArchived: false,
    projectId: 'lwii3lg4a1iYi7ZC',
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: false },
})
export class Ejemplo2CalculadoraEImpuestosWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '34b60349-624d-4e9a-b3bc-9aed30db10ab',
        webhookId: 'd9ddcc4a-0482-42e7-a10d-e2633b0c028e',
        name: 'Webhook Entrante',
        type: 'n8n-nodes-base.webhook',
        version: 2,
        position: [0, 0],
    })
    WebhookEntrante = {
        httpMethod: 'POST',
        path: 'calcular-precio',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c574db1e-d454-44f5-bb9d-0c95b6ddc435',
        name: 'Calcular IVA y Total',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [224, 0],
    })
    CalcularIvaYTotal = {
        jsCode: `// Extraer datos entrantes del body
const item = $input.item.json.body;

const price = Number(item.price) || 0;
const vatRate = 0.16;
const vatAmount = price * vatRate;
const total = price + vatAmount;

return {
  json: {
    status: "success",
    product: item.product || "Producto Desconocido",
    base_price: price,
    vat_amount: vatAmount,
    total_price: total,
    processed_at: new Date().toISOString()
  }
};`,
    };

    @node({
        id: '0a91ab12-9d50-424a-8c17-304698a7b852',
        name: 'Responder HTTP 200',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.1,
        position: [448, 0],
    })
    ResponderHttp200 = {
        respondWith: 'allIncomingItems',
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.WebhookEntrante.out(0).to(this.CalcularIvaYTotal.in(0));
        this.CalcularIvaYTotal.out(0).to(this.ResponderHttp200.in(0));
    }
}
