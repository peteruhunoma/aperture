import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import moment from "moment";
import Header from "./Header.jsx"

function UploadProduct() {
  
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [stockNumber, setStockNumber] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [tempImage, setTempImage] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [error, setError] = useState("");
  const handleBrowseClick = (e) => {
    e.preventDefault();
    document.getElementById('files').click();
  }
  const handleFilePick = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
  
    setTempImage(prev => {
      const total = prev.length + files.length;
      if (total > 5) {
        alert('You can upload max 5 images');
        return prev;
      }
      return [...prev, ...files];
    });
    e.target.value = null;          
  };

  const removePreview = (idx) =>
  setTempImage(prev => prev.filter((_, i) => i !== idx));

   
  const handleChange = (e) => {
    console.log("Selected value:", e.target.value); 
    setCategory(e.target.value);
  };
  
  const cats =  async () => {
    try{
    const res = await axios.get("http://localhost:3000/posts/categories", {withCredentials:true});
    res;
    setCategory(res.data);
  }catch(err){
    console.log(err)
  }
  }
useEffect(() => {
  cats();

  
}, [])



const publish = async (e) => {
  e.preventDefault();
  if (isSubmit)  return;
  setIsSubmit(true);
  if (!tempImage.length) return alert('Please select at least one image');

  setImageFile(tempImage);

  const formData = new FormData();
  formData.append('productName', productName);
  tempImage.forEach(file => formData.append('images', file)); 

  try {
    const { data } = await axios.post('http://localhost:3000/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    });

    const media = data.filenames;         
    const stock = Number(stockNumber)
    const res = await axios.post(
      'http://localhost:3000/posts/',
      {
        productName,
        productDescription,
        media,
        category: selectedCategory,
        price,
        stock,
        date: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      { withCredentials: true }
    );
      console.log(res);
      if(res.status === 200){
        setIsSubmit(false);
        history.push("/");
      }
    setTempImage([]);
    setImageFile(null);
  } catch (err) {
    if(err.response.data.error === "Only image formats (JPEG, PNG, JPG) allowed"){
      setError("Only image formats (JPEG, PNG, JPG) allowed");
    }

  } 
};

  return (
<div className="font-display">
<div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
<div className="layout-container flex h-full grow flex-col">
<div className="flex flex-1 justify-center py-5 sm:px-4 md:px-10 lg:px-20 xl:px-40">
<div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
<Header/>
<main className="flex-1 p-4 sm:p-6 md:p-8">
<div className="flex flex-wrap justify-between items-center gap-4 mb-8">
<p className="text-gray-900 dark:text-gray-100 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Add a New Product</p>
</div>
<form onSubmit={publish} method="POST">
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
<div className="lg:col-span-2 space-y-8">
<div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 mb-4">
<h2 className="text-gray-900 dark:text-gray-100 text-[22px] font-bold leading-tight tracking-[-0.015em] pb-5">Product Details</h2>
<div className="space-y-6">
<label className="flex flex-col w-full">
<p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">Product Name</p>
<input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-blue/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark h-12 placeholder:text-gray-500 dark:placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal" placeholder="e.g., Modern Leather Sofa" onChange={e => setProductName(e.target.value)} />
</label>
<label className="flex flex-col w-full">
<p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">Product Description</p>
<textarea className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-blue/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark min-h-36 placeholder:text-gray-500 dark:placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal" placeholder="Describe your product in detail..." onChange={e => setProductDescription(e.target.value)}></textarea>
</label>
</div>
</div>
<div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 ">
<h2 className="text-gray-900 dark:text-gray-100 text-[22px] font-bold leading-tight tracking-[-0.015em] pb-2">Media</h2>
<p className="text-gray-600 dark:text-gray-400 text-sm mb-5">Upload up to 5 images. The first image will be the main one.</p>
<label htmlFor="files" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center bg-background-light dark:bg-background-dark">
<span className="material-symbols-outlined text-4xl text-blue mb-2">cloud_upload</span>
<p className="text-gray-800 dark:text-gray-200 font-medium">Drag &amp; drop your files here</p>
<p className="text-gray-500 dark:text-gray-400 text-sm">or</p>
<button htmlFor="files" onClick={handleBrowseClick} className="mt-2 flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-9 bg-blue/10 text-blue gap-2 text-sm font-bold leading-normal min-w-0 px-4">Browse Files</button>
</label>
<input className="" type="file" name="media" id="files" accept="image/*" multiple onChange={handleFilePick}
/>
{ tempImage && tempImage.map((file, index) => (
  <p
  key={index}
  className="pt-4 pb-4 pl-4 pr-4 border border-blue-100 flex items-center justify-between"
>
  {`${file.name} - ${file.type}`}
  <button
    type="button"
    onClick={() => removePreview(index)}
    className=" bg-red-500 text-white  p-[5px]   hover:bg-red-600"
  >
    remove
  </button>
</p>
))}
</div>
<p className='text-red-500'>{error}</p>
</div>
<div className="lg:col-span-1 space-y-8">
<div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 ">
<h2 className="text-gray-900 dark:text-gray-100 text-[22px] font-bold leading-tight tracking-[-0.015em] pb-5">Organization &amp; Pricing</h2>
<div className="space-y-6">
<label className="flex flex-col w-full">
<p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">Category</p>
<div className="relative w-full">


<select  className="form-select appearance-none flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-blue/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark h-12 placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 py-2 text-base font-normal leading-normal" value={selectedCategory} onChange={ e => setSelectedCategory(e.target.value)}>
<option defaultValue>Select a category</option>
{Array.isArray(category) && category.map(items => (
<option key={items.id} value={items.category}>{items.category}</option>

)) }
</select>



<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300">
<span className="material-symbols-outlined">expand_more</span>
</div>
</div>
</label>
<label className="flex flex-col w-full">
<p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">Price</p>
<div className="relative">
<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
<span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
</div>
<input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-blue/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark h-12 placeholder:text-gray-500 dark:placeholder:text-gray-400 pl-7 pr-4 text-base font-normal leading-normal" placeholder="0.00" onChange={e => setPrice(e.target.value)}/>
</div>
</label>
<label className="flex flex-col w-full">
<p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">Stock</p>
<div className="relative">
<input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-blue/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark h-12 placeholder:text-gray-500 dark:placeholder:text-gray-400 pl-7 pr-4 text-base font-normal leading-normal" placeholder="100000" onChange={e => setStockNumber(e.target.value)}/>
</div>
</label>
</div>
</div>
<div className="flex flex-col sm:flex-row gap-3 pt-4">
<button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-gray-700 dark:text-gray-300 text-base font-bold leading-normal w-full sm:w-auto px-6">Cancel</button>
<button className="flex flex-1 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-blue/20 text-blue gap-2 text-base font-bold leading-normal w-full sm:w-auto px-6 whitespace-nowrap">Save Draft</button>
<button onSubmit={publish} className="flex flex-1 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-blue text-white gap-2 text-base font-bold leading-normal w-full sm:w-auto px-6 whitespace-nowrap" disabled={isSubmit}>{isSubmit ?  "published" : "publish"}</button>
</div>
</div>
</div>
</form>
</main>
</div>
</div>
</div>
</div>
</div>     
  )
}

export default UploadProduct;


