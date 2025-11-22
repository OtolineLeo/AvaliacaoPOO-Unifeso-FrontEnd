const API_URL = 'http://localhost:5259/api'; // Ajuste a porta do seu back-end

export const api = {
  // Produtos
  getProdutos: async () => {
    try{
        const response = await fetch(`${API_URL}/produto`);
        if (!response.ok) throw new Error('Erro ao buscar produtos');
        return await response.json();
    } catch (error){
        console.error('Erro na Api: ', error);
        throw error;
        }
},
  
  getProduto: async (id) => {
    try{
        const response = await fetch(`${API_URL}/produto/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar produto');
        return await response.json();
    }catch(error){
        console.error('Erro na Api: ', error);
        throw error;
        }
},
  
  createProduto: async (produto) => {
    try{
        const response = await fetch(`${API_URL}/produto`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto),
    });
        if (!response.ok) throw new Error('Erro ao criar produto');
        return await response.json();
    }catch(error){
        console.error('Erro na Api: ', error);
        throw error;
        }
  },
  
  // Carrinho
  adicionarAoCarrinho: async (produtoId, quantidade = 1) => { 
    try {
      const response = await fetch(`${API_URL}/carrinho`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ produtoId, quantidade }), 
      });
      if (!response.ok) throw new Error('Erro ao adicionar ao carrinho');
      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  getCarrinho: async () => {
    try {
      const response = await fetch(`${API_URL}/carrinho`);
      if (!response.ok) throw new Error('Erro ao buscar carrinho');
      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  removerDoCarrinho: async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/carrinho/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao remover do carrinho');
      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },
};