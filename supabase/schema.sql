-- ==============================================================================
-- FACTURE RDSH — SCHEMA POSTGRESQL SUPABASE
-- SaaS de Facturation Professionnelle (Burundi & Afrique)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE ORGANIZATIONS (Entreprises émettrices)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    nif TEXT,
    rc TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT DEFAULT 'Bujumbura',
    country TEXT DEFAULT 'Burundi',
    currency TEXT DEFAULT 'BIF',
    default_tax_rate NUMERIC(5,2) DEFAULT 15.00,
    default_payment_terms_days INTEGER DEFAULT 30,
    invoice_prefix TEXT DEFAULT 'FAC',
    next_invoice_number INTEGER DEFAULT 31,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE CLIENTS (Entreprises & particuliers clients)
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT DEFAULT 'Bujumbura',
    nif TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE INVOICES (Factures)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'cancelled', 'overdue')),
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    currency TEXT NOT NULL DEFAULT 'BIF',
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 15.00,
    subtotal NUMERIC(15,2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    total NUMERIC(15,2) NOT NULL DEFAULT 0,
    notes TEXT,
    payment_method TEXT DEFAULT 'Lumicash / Virement',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLE INVOICE_ITEMS (Lignes de facture)
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
    unit_price NUMERIC(15,2) NOT NULL DEFAULT 0,
    line_total NUMERIC(15,2) NOT NULL DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_invoices_organization_id ON public.invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON public.invoices(issue_date);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_clients_org ON public.clients(organization_id);

-- 7. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Permissive public policies for authenticated / anon in early phase
CREATE POLICY "Public read organizations" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "Public write organizations" ON public.organizations FOR ALL USING (true);

CREATE POLICY "Public read clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Public write clients" ON public.clients FOR ALL USING (true);

CREATE POLICY "Public read invoices" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Public write invoices" ON public.invoices FOR ALL USING (true);

CREATE POLICY "Public read items" ON public.invoice_items FOR SELECT USING (true);
CREATE POLICY "Public write items" ON public.invoice_items FOR ALL USING (true);

-- 8. SEED INITIAL DATA (RDSH Organization & Seed Clients)
INSERT INTO public.organizations (
    id, name, nif, rc, email, phone, address, city, country, currency, default_tax_rate, invoice_prefix, next_invoice_number
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'RDSH Solutions',
    '4000123456',
    'RC-BJA-2024-B-0145',
    'contact@facture-rdsh.bi',
    '+257 79 123 456',
    'Chaussée Prince Louis Rwagasore, Rohero II',
    'Bujumbura',
    'Burundi',
    'BIF',
    15.00,
    'FAC',
    31
) ON CONFLICT (id) DO NOTHING;

-- Seed top clients
INSERT INTO public.clients (id, organization_id, name, email, phone, address, city, nif) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Brasseries du Burundi (BRARUDI)', 'contact@brarudi.bi', '+257 22 22 25 41', 'Boulevard du 1er Novembre', 'Bujumbura', '4000000010'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Lumitel (Viettel Burundi)', 'corporate@lumitel.bi', '+257 31 00 00 00', 'Boulevard de la Liberté, Rohero', 'Bujumbura', '4000000020'),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Econet Leo', 'business@econet.bi', '+257 79 00 01 11', 'Avenue du Commerce, Centre-Ville', 'Bujumbura', '4000000030'),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'REGIDESO Burundi', 'facturation@regideso.bi', '+257 22 22 27 10', 'Avenue des Travailleurs', 'Bujumbura', '4000000040'),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Banque Commerciale du Burundi (BANCOBU)', 'info@bancobu.bi', '+257 22 22 23 17', 'Boulevard Patrice Lumumba', 'Bujumbura', '4000000050')
ON CONFLICT (id) DO NOTHING;
