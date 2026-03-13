# Dicionário do Banco de Dados (AgendeJá)

Este documento descreve a estrutura do banco de dados PostgreSQL hospedado na Oracle Cloud, utilizado pelo Marketplace AgendeJá.

---

## 🏗️ Estrutura de Tabelas (Schemas)

O banco está organizado em torno de fluxos de **Usuários**, **Empresas** e **Agendamentos**.

### 1. Gestão de Identidade e Acesso
| Tabela | Descrição | Principais Campos |
| :--- | :--- | :--- |
| **`User`** | Armazena todos os usuários do sistema (Clientes e Donos de Negócio). | `id`, `name`, `email`, `role`, `password`, `cpf` [NEW], `address` [NEW]. |
| **`UserLeads`** | (Relação) Associa leads a usuários específicos para acompanhamento. | `id`, `companyId`, `userId`, `interest`. |

### 2. Marketplace e Estabelecimentos
| Tabela | Descrição | Principais Campos |
| :--- | :--- | :--- |
| **`Company`** | Cadastro principal da empresa/loja no marketplace. | `id`, `ownerId`, `name`, `niche`, `whatsapp`, `cnpj`, `legalName`, `imageUrl`. |
| **`Location`** | Endereços físicos das unidades de atendimento. | `id`, `companyId`, `name`, `address`, `cep`. |
| **`Employee`** | Profissionais vinculados a uma empresa e localização. | `id`, `companyId`, `locationId`, `name`, `role` [NEW], `image` [NEW], `hours` [NEW]. |

### 3. Catálogo e Operações
| Tabela | Descrição | Principais Campos |
| :--- | :--- | :--- |
| **`Service`** | Serviços oferecidos (ex: Corte de Cabelo, Manicure). | `id`, `companyId`, `name`, `price`, `promoPrice` [NEW], `duration`, `description` [NEW]. |
| **`Product`** | Produtos à venda no marketplace. | `id`, `companyId`, `name`, `price`, `delivery`. |
| **`Lead`** | Potenciais clientes interessados em serviços/produtos. | `id`, `name`, `phone`, `interest`, `converted`. |

### 4. Transacional e Auditoria
| Tabela | Descrição | Principais Campos |
| :--- | :--- | :--- |
| **`Appointment`** | Registros de agendamentos realizados. | `id`, `employeeId`, `serviceId`, `date`, `status`. |
| **`Block`** | Feriados, folgas e bloqueios de agenda. | `id`, `companyId`, `employeeId`, `date`, `situation`, `reason`. |
| **`AuditLog`** | Log técnico de consultas e alterações no sistema. | `id`, `userId`, `query`, `timestamp`. |

---

## 🛠️ Objetos do Servidor

*   **Índices:** Gerenciados automaticamente pelo Prisma no campo `id` (Primary Key) e campos com `@unique` (ex: `User.email`).
*   **Enums:**
    *   `Role`: Define se o acesso é `CLIENT` ou `BUSINESS`.
    *   `AppointmentStatus`: Estados do agendamento (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`).
*   **Triggers / Views:** Atualmente o sistema utiliza a lógica do Prisma Client para integridade e automação. Consultas complexas são feitas via código (API Routes).

---
*Atualizado em: 14/03/2026*
