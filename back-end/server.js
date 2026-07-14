const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Abrindo ou criando o arquivo do banco
const db = new sqlite3.Database('./bebidas_db.sqlite');

// Ativa o suporte a chaves estrangeiras no SQLite
db.run("PRAGMA foreign_keys = ON");

// =========================================================================
// INICIALIZAÇÃO DO BANCO DE DADOS 
// =========================================================================
db.serialize(() => {
    //TABELA: categorias
    db.run(`
        CREATE TABLE IF NOT EXISTS categorias (
            id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_categoria TEXT NOT NULL,
            descricao TEXT
        )
    `);

    db.run(`
        INSERT OR IGNORE INTO categorias (id_categoria, nome_categoria, descricao) VALUES 
        (1, 'Concentrados', 'Matéria-prima para o sabor das bebidas'),
        (2, 'Açúcar', 'Componente de dulçor e xarope'),
        (3, 'Embalagens', 'Garrafas PET, tampas e rótulos')
    `);

    //TABELA: setores
    db.run(`
        CREATE TABLE IF NOT EXISTS setores (
            id_setor INTEGER PRIMARY KEY AUTOINCREMENT,
            setor TEXT NOT NULL,
            descricao TEXT
        )
    `);

    db.run(`
        INSERT OR IGNORE INTO setores (id_setor, setor, descricao) VALUES 
        (1, 'Almoxarifado Central', 'Recebimento e estocagem de insumos'),
        (2, 'Linha de Envase', 'Setor responsável pelo engarrafamento'),
        (3, 'Xaroparia', 'Preparação e mistura dos xaropes e concentrados')
    `);

    //TABELA: fornecedores 
    db.run(`
        CREATE TABLE IF NOT EXISTS fornecedores (
            id_fornecedor INTEGER PRIMARY KEY AUTOINCREMENT,
            nome VARCHAR(100) NOT NULL,
            cnpj VARCHAR(20) UNIQUE NOT NULL,
            telefone VARCHAR(20),
            email VARCHAR(100),
            endereco VARCHAR(200)
        )
    `);

    db.run(`
        INSERT OR IGNORE INTO fornecedores (id_fornecedor, nome, cnpj, telefone, email, endereco) VALUES 
        (1, 'Ambev Fornecimentos', '12.345.678/0001-99', '(11) 99999-9999', 'contato@ambevfornece.com', 'Av. das Nações, 1000'),
        (2, 'Usinas Brasileiras S.A.', '98.765.432/0001-88', '(16) 3333-2222', 'vendas@usinasbr.com', 'Rodovia do Açúcar, Km 45'),
        (3, 'Plásticos Nordeste', '45.678.912/0001-77', '(81) 3444-5555', 'comercial@plastnordeste.com', 'Distrito Industrial, Lote 4')
    `);

    //TABELA: usuarios
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_usuario TEXT NOT NULL,
            cargo TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL,
            id_setor INTEGER,
            FOREIGN KEY (id_setor) REFERENCES setores(id_setor)
        )
    `);

    db.run(`
        INSERT OR IGNORE INTO usuarios (nome_usuario, cargo, email, senha, id_setor) VALUES 
        ('Paulo', 'Administrador de Envase', 'admin@bebidas.com', '123456', 2),
        ('Cecilia', 'Gerente de Producao', 'gerente@bebidas.com', '654321', 3),
        ('Miguel', 'Operador Almoxarifado', 'operador@bebidas.com', '444777', 1)
    `);

    //TABELA: insumos
    db.run(`
        CREATE TABLE IF NOT EXISTS insumos (
            id_insumo INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_insumo TEXT NOT NULL,
            descricao TEXT,
            unidade_medida TEXT NOT NULL,
            quantidade_estoque REAL NOT NULL DEFAULT 0,
            estoque_minimo REAL NOT NULL DEFAULT 0,
            data_validade TEXT,
            lote TEXT,
            volume TEXT,
            id_categoria INTEGER,
            id_fornecedor INTEGER,
            FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
            FOREIGN KEY (id_fornecedor) REFERENCES fornecedores(id_fornecedor)
        )
    `);

    db.run(`
        INSERT OR IGNORE INTO insumos (id_insumo, nome_insumo, descricao, unidade_medida, quantidade_estoque, estoque_minimo, data_validade, lote, volume, id_categoria, id_fornecedor) VALUES 
        (1, 'Concentrado de Guaraná', 'Extrato original para refrigerante', 'Litros', 150.00, 50.00, '2027-12-31', 'L-GUA99', '20L', 1, 1),
        (2, 'Açúcar Cristal', 'Sacos de açúcar refinado', 'Kg', 1200.00, 300.00, '2026-10-15', 'L-AC202', '50Kg', 2, 2),
        (3, 'Garrafa PET 2L Transparente', 'Fardos de garrafas vazias', 'Unidades', 5000.00, 1000.00, NULL, 'L-PET44', 'N/A', 3, 3)
    `);

    //TABELA: movimentacoes 
    db.run(`
        CREATE TABLE IF NOT EXISTS movimentacoes (
            id_movimentacao INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo_movimentacao TEXT NOT NULL,
            quantidade REAL NOT NULL,
            data_movimentacao TEXT NOT NULL,
            observacao TEXT,
            id_insumo INTEGER,
            id_usuario INTEGER,
            id_setor INTEGER,
            FOREIGN KEY (id_insumo) REFERENCES insumos(id_insumo),
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
            FOREIGN KEY (id_setor) REFERENCES setores(id_setor)
        )
    `);

    db.run(`
        INSERT OR IGNORE INTO movimentacoes (tipo_movimentacao, quantidade, data_movimentacao, observacao, id_insumo, id_usuario, id_setor) VALUES 
        ('REPOSIÇÃO', 100.00, '2026-06-20 14:30:00', 'Entrada de carga do fornecedor', 1, 3, 1),
        ('RETIRADA', 20.00, '2026-06-21 08:15:00', 'Abastecimento para início do lote', 1, 1, 2),
        ('RETIRADA', 500.00, '2026-06-22 10:00:00', 'Liberação de embalagens para envase', 3, 1, 2)
    `);

    //TABELA: alertas_estoque
    db.run(`
        CREATE TABLE IF NOT EXISTS alertas_estoque (
            id_alerta INTEGER PRIMARY KEY AUTOINCREMENT,
            mensagem TEXT NOT NULL,
            nivel_estoque REAL NOT NULL,
            data_alerta TEXT NOT NULL,
            status_alerta TEXT NOT NULL DEFAULT 'ATIVO',
            id_insumo INTEGER,
            FOREIGN KEY (id_insumo) REFERENCES insumos(id_insumo)
        )
    `);

    db.run(`
        INSERT OR IGNORE INTO alertas_estoque (mensagem, nivel_estoque, data_alerta, status_alerta, id_insumo) VALUES 
        ('Alerta: Concentrado de Guaraná próximo ao limite mínimo!', 52.00, '2026-06-19 11:00:00', 'RESOLVIDO', 1),
        ('Crítico: Estoque de Açúcar Cristal abaixo do limite de segurança!', 250.00, '2026-06-22 18:22:00', 'ATIVO', 2),
        ('Aviso: Lote de Garrafas PET atingiu nível de atenção.', 1050.00, '2026-06-22 19:05:00', 'ATIVO', 3)
    `);

    console.log("Todas as tabelas e relacionamentos foram estruturados com sucesso!");
});
// ==========================================================
// ROTAS DA APLICAÇÃO
// ==========================================================

// ROTA DE LOGIN
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    db.get(`SELECT * FROM usuarios WHERE email = ?`, [email], (err, usuario) => {
        if (err) return res.status(500).json({ mensagem: "Erro interno no servidor" });
        if (!usuario || senha !== usuario.senha) {
            return res.status(401).json({ mensagem: "Usuário ou senha inválidos" });
        }
        return res.status(200).json({ mensagem: "Login efetuado com sucesso!" });
    });
});

//ROTA: Listar todos os insumos 
app.get('/api/insumos', (req, res) => {
    const sql = `
        SELECT i.*, c.nome_categoria, f.nome AS nome_fornecedor 
        FROM insumos i
        LEFT JOIN categorias c ON i.id_categoria = c.id_categoria
        LEFT JOIN fornecedores f ON i.id_fornecedor = f.id_fornecedor
        ORDER BY i.id_insumo DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Erro ao buscar insumos:", err.message);
            return res.status(500).json({ error: "Erro ao buscar insumos." });
        }
        res.json(rows);
    });
});

//Busca dinâmica para consulta de Insumos 
app.get('/api/insumos/busca', (req, res) => {
    const termo = req.query.termo || ''; 
    const termoCoringa = `%${termo}%`;

    const sql = `
        SELECT i.*, c.nome_categoria, f.nome AS nome_fornecedor 
        FROM insumos i
        LEFT JOIN categorias c ON i.id_categoria = c.id_categoria
        LEFT JOIN fornecedores f ON i.id_fornecedor = f.id_fornecedor
        WHERE i.id_insumo LIKE ? 
           OR i.nome_insumo LIKE ? 
           OR i.lote LIKE ?
           OR f.nome LIKE ?
    `;

    db.all(sql, [termoCoringa, termoCoringa, termoCoringa, termoCoringa], (err, rows) => {
        if (err) {
            console.error("Erro na busca dinâmica:", err.message);
            return res.status(500).json({ error: "Erro interno ao realizar busca." });
        }
        res.json(rows); 
    });
});

//ROTA: Buscar um insumo específico pelo ID 
app.get('/api/insumos/:id', (req, res) => {
    const idInsumo = req.params.id;
    const sql = "SELECT * FROM insumos WHERE id_insumo = ?";
    db.get(sql, [idInsumo], (err, row) => {
        if (err) return res.status(500).json({ error: "Erro no banco de dados." });
        if (!row) return res.status(404).json({ error: "Insumo não encontrado." });
        res.json(row);
    });
});

// ==========================================
//ROTA: Listar Fornecedores (GET)
// ==========================================
app.get('/api/fornecedores', (req, res) => {
    const sql = "SELECT id_fornecedor, nome FROM fornecedores ORDER BY nome ASC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao buscar fornecedores." });
        }
        res.json(rows);
    });
});

// ==========================================
//CADASTRAR Novo Insumo (POST)
// ==========================================
app.post('/api/insumos', (req, res) => {
    // O id_fornecedor vem diretamente do <select> do HTML
    const { nome_insumo, descricao, unidade_medida, quantidade_estoque, estoque_minimo, data_validade, lote, volume, id_categoria, id_fornecedor } = req.body;
    
    const sql = `INSERT INTO insumos (nome_insumo, descricao, unidade_medida, quantidade_estoque, estoque_minimo, data_validade, lote, volume, id_categoria, id_fornecedor) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [nome_insumo, descricao, unidade_medida, quantidade_estoque, estoque_minimo, data_validade, lote, volume, id_categoria, id_fornecedor];

    db.run(sql, params, function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao inserir o insumo." });
        }
        res.status(201).json({ id_insumo: this.lastID });
    });
});

// ==========================================
//ATUALIZAR um Insumo Existente (PUT)
// ==========================================
app.put('/api/insumos/:id', (req, res) => {
    const idInsumo = req.params.id;
    const { nome_insumo, descricao, unidade_medida, quantidade_estoque, estoque_minimo, data_validade, lote, volume, id_categoria, id_fornecedor } = req.body;

    const sql = `UPDATE insumos SET 
                    nome_insumo = ?, 
                    descricao = ?, 
                    unidade_medida = ?, 
                    quantidade_estoque = ?, 
                    estoque_minimo = ?, 
                    data_validade = ?, 
                    lote = ?, 
                    volume = ?, 
                    id_categoria = ?, 
                    id_fornecedor = ?
                 WHERE id_insumo = ?`;

    const params = [nome_insumo, descricao, unidade_medida, quantidade_estoque, estoque_minimo, data_validade, lote, volume, id_categoria, id_fornecedor, idInsumo];

    db.run(sql, params, function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao atualizar o insumo." });
        }
        if (this.changes === 0) return res.status(404).json({ error: "Insumo não encontrado." });
        res.json({ message: "Insumo atualizado com sucesso!" });
    });
});

// ==========================================
//DELETAR um Insumo (DELETE)
// ==========================================
app.delete('/api/insumos/:id', (req, res) => {
    const idInsumo = req.params.id;
    const sql = "DELETE FROM insumos WHERE id_insumo = ?";
    
    db.run(sql, idInsumo, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao excluir o insumo." });
        }
        if (this.changes === 0) return res.status(404).json({ error: "Insumo não encontrado." });
        res.json({ message: "Insumo deletado com sucesso!" });
    });
});

app.get('/api/setores',(req,res)=>{
    const sql = "SELECT * FROM setores";
    db.all(sql,[],(err,rows)=>{
        if(err){
            return res.status(500).json({error: "Erro ao buscar setores"});
        }
        res.json(rows);
    });
});
app.get('/api/movimentacoes',(req,res) =>{
    const sql = `
        SELECT m.id_movimentacao, m.data_movimentacao, m.tipo_movimentacao, m.quantidade, 
               i.nome_insumo, s.setor, u.nome_usuario 
        FROM movimentacoes m
        JOIN insumos i ON m.id_insumo = i.id_insumo
        LEFT JOIN setores s ON m.id_setor = s.id_setor
        LEFT JOIN usuarios u ON m.id_usuario = u.id_usuario
        ORDER BY m.data_movimentacao DESC
    `;
    db.all(sql,[],(err,rows) => {
        if(err) return res.status(500).json({ error: "Erro ao buscar histórico"});
        res.json(rows);
    });
});

app.post('/api/movimentacoes',(req,res) => {
    const {id_insumo, tipo_movimentacao, quantidade, id_setor, id_usuario} = req.body;
    const data_movimentacao = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let sqlUpdate = "";
    if(tipo_movimentacao === 'REPOSIÇÃO') {
        sqlUpdate = "UPDATE insumos SET quantidade_estoque = quantidade_estoque + ? WHERE id_insumo = ?";
    } else {
        sqlUpdate = "UPDATE insumos SET quantidade_estoque = quantidade_estoque - ? WHERE id_insumo = ?";
    }

    db.run(sqlUpdate,[quantidade, id_insumo],function(err){
        if(err) return res.status(500).json({error: "Erro ao atualizar estoque."});
        const sqlInsert = `
            INSERT INTO movimentacoes (tipo_movimentacao, quantidade, data_movimentacao, id_insumo, id_usuario, id_setor) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.run(sqlInsert,[tipo_movimentacao,quantidade,data_movimentacao,id_insumo,id_usuario,id_setor],function(err){
            if(err) return res.status(500).json({error:"Erro ao gravar histórico." });
            res.status(201).json({ message: "Sucesso!"});
        });
    });

});


app.listen(3000, () => {
    console.log('Express Server running on http://localhost:3000/login.html');
});