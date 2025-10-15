import axios from 'axios';

/**
 * Instância configurada do Axios para comunicação com a API
 * 
 * Configurações:
 * - URL base: http://localhost:3000
 * - Timeout: 10 segundos
 * 
 * @constant {AxiosInstance} api
 * 
 * @example
 * // Buscar todos os livros
 * const response = await api.get('/livros');
 * 
 * @example
 * // Criar novo livro
 * const response = await api.post('/livros', {
 *   titulo: 'Novo Livro',
 *   autor: 'Autor'
 * });
 * 
 * @example
 * // Atualizar livro
 * const response = await api.put('/livros/1', dados);
 * 
 * @example
 * // Excluir livro
 * const response = await api.delete('/livros/1');
 */
const api = axios.create({
  baseURL: 'http://localhost:3000', // URL base da API backend
  timeout: 10000, // Tempo limite de 10 segundos para requisições
});

export default api;
