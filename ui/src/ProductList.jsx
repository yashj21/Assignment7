import ProductTable from './ProductTable.jsx';
import ProductAdd from './ProductAdd.jsx';
import graphQLFetch from './graphQLFetch.js';
import React from '../node_modules/react';
import ReactDOM from '../node_modules/react-dom';
import { Label } from 'react-bootstrap';

export default class ProductList extends React.Component {
    constructor() {
      super();
      this.state = {
        productArray: [],
        count : 0,
      };
      this.createProducts = this.createProducts.bind(this);
      this.deleteProduct = this.deleteProduct.bind(this);
    }
  
    componentDidMount() {
      this.loadData();
      this.productCount();
    }
  
    async productCount() {
      const query  = 'query{productCounts{count}}';
      const response = await fetch(window.ENV.UI_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const result = await response.json();
      if (result.data.productCounts.length > 0) {
        this.setState({ count: result.data.productCounts[0].count });
      } else {
        this.setState({ count: 0 });
      }
    }
    async loadData() {
      const query = `query {
        productList {
          id productcat productname productprice producturl
        }
      }`;
      const data = await graphQLFetch(query);
      this.setState({ productArray: data.productList });
    }
  
    async createProducts(product) {
      const newProduct = product;
      // product.id = this.state.productArray.length +1;
      // const existingLists = this.state.productArray.slice();
      // existingLists.push(product);
      // this.setState({
      //     productArray:existingLists
      // });
      const query = `mutation {
                  productAdd(product: {
                  productcat: ${newProduct.productcat}
                  productname: "${newProduct.productname}"
                  productprice: ${newProduct.productprice}
                  producturl: "${newProduct.producturl}"
                }) {
                  id
                }
          }`;
      const data = await graphQLFetch(query);
      if (data) {
        this.productCount();
        this.loadData();
      }
    }
    // componentDidMount() {
    //     this.setState({
    //         productArray:[{}]
    //     }) }
  
    // createProducts(product){
    //     product.id = new Date().getTime();
    //     const existingLists = this.state.productArray.slice();
    //     existingLists.push(product);
    //     this.setState({
    //         productArray:existingLists
    //     });
    // }
    async deleteProduct(id) {
      const query = `mutation productDelete($id: Int!) {
        productDelete(id: $id)
      }`;
      // // const { products } = this.state;
      // // const { location: { pathname, search }, history } = this.props;
      // // const { id } = issues[index];
      const variables = { id };
      await fetch(window.ENV.UI_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });
      alert('Product deleted product successfully!');
      this.productCount();
      this.loadData();
    }
    render() {
      const curstate = this.state;
      const { count } = this.state;
      return (
        <React.Fragment>
          <h4>Showing {count} available products
          </h4>
          <hr />
          <ProductTable productArray={curstate.productArray} deleteProduct={this.deleteProduct}/>
          <hr />
          <h4>Add a new product to inventory</h4>
          <ProductAdd createProducts={this.createProducts} />
        </React.Fragment>
      );
    }
  }