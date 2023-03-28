import './HomeScreen.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid } from '@material-ui/core';
import SearchBar from 'material-ui-search-bar';
// Components
import Product from '../components/Product';

//Actions
import { getProducts as listProducts } from '../redux/actions/productActions';
import { setUserDeatils } from '../redux/actions/userAction';
import { Tabs, Tab } from '@material-ui/core';
import { filterObj } from '../utils/utils.function';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState('all');
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [tempData, setTempData] = useState([]);

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getProducts = useSelector((state) => state.getProducts);
  const { products, loading, error } = getProducts;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setUserDeatils());
  }, [dispatch]);
  useEffect(() => {
    const category = products.map((product) => product.category);
    setCategories([...new Set(category)]);
  }, [products]);

  useEffect(() => {
    if (tabValue === 'all') {
      setFilteredProducts(products);
      setTempData(products);
    } else {
      const filtered = products.filter(
        (product) => product.category === tabValue
      );
      setFilteredProducts(filtered);
      setTempData(products);
    }
  }, [tabValue, products]);

  useEffect(() => {
    if (searchText.length < 3) {
      setFilteredProducts(tempData);
      return;
    }
    const filter = filterObj(filteredProducts, ['name'], searchText);
    setFilteredProducts(filter);
  }, [searchText]);
  return (
    <>
      <Grid container>
        <Grid item xs={2}>
          <div style={{ padding: 20 }}>
            <h2
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              Categories
            </h2>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={tabValue}
              onChange={tabChange}
              style={{ borderRight: '1px solid' }}
            >
              <Tab label="All" value={'all'} />
              {categories?.map((category) => (
                <Tab key={category} label={category} value={category} />
              ))}
            </Tabs>
          </div>
        </Grid>
        <Grid item xs={10}>
          <div style={{ padding: 10 }}>
            <SearchBar
              value={searchText}
              onChange={(newValue) => setSearchText(newValue)}
            />
          </div>
          <h2 className="homescreen__title">Latest Products</h2>

          <div className="homescreen__products">
            {loading ? (
              <h2>Loading...</h2>
            ) : error ? (
              <h2>{error}</h2>
            ) : (
              filteredProducts?.map((product) => (
                <Product
                  key={product._id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  productId={product._id}
                />
              ))
            )}
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default HomeScreen;
