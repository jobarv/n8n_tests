import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Xataka RSS to Discord Notifier
// Nodes   : 4  |  Connections: 3
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ScheduleTrigger                    scheduleTrigger
// ReadXatakaRss                      rssFeedRead
// Limit                              limit
// Discord                            discord                    [creds]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ScheduleTrigger
//    → ReadXatakaRss
//      → Limit
//        → Discord
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'amah8FiSQgmwIHQM',
    name: 'Xataka RSS to Discord Notifier',
    active: true,
    isArchived: false,
    projectId: 'lwii3lg4a1iYi7ZC',
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: true },
})
export class XatakaRssToDiscordNotifierWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'aba496c7-2782-47fa-b125-0810c3921410',
        name: 'Schedule Trigger',
        type: 'n8n-nodes-base.scheduleTrigger',
        version: 1.2,
        position: [192, -96],
    })
    ScheduleTrigger = {
        rule: {
            interval: [
                {
                    triggerAtHour: 4,
                },
            ],
        },
    };

    @node({
        id: '3ceade08-8c14-49df-9ff5-f332776fd498',
        name: 'Read Xataka RSS',
        type: 'n8n-nodes-base.rssFeedRead',
        version: 1.1,
        position: [416, -96],
    })
    ReadXatakaRss = {
        url: 'https://www.xataka.com/feedburner.xml',
        options: {},
    };

    @node({
        id: '8601ce6b-f3cc-4add-babd-e4962747c60a',
        name: 'Limit',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [624, -96],
    })
    Limit = {
        maxItems: 5,
    };

    @node({
        id: 'cd5456f0-863f-4c24-b50c-69f6b4e41450',
        webhookId: '096b5a00-6618-48d3-b85a-3bfc6899c7da',
        name: 'Discord',
        type: 'n8n-nodes-base.discord',
        version: 2,
        position: [816, -96],
        credentials: { discordWebhookApi: { id: '3MpDdLTGnTUehZOU', name: 'Discord Webhook account' } },
    })
    Discord = {
        authentication: 'webhook',
        content: `=Estas son las ultimas noticias de XATAKA!

{{ $json.title }}

{{ $json.link }}
{{ $json.pubDate }}`,
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.ScheduleTrigger.out(0).to(this.ReadXatakaRss.in(0));
        this.ReadXatakaRss.out(0).to(this.Limit.in(0));
        this.Limit.out(0).to(this.Discord.in(0));
    }
}
