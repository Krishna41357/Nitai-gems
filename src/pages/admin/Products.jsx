import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import CategoriesTab from "../../components/admin/CategoriesTab";
import SubcategoriesTab from "../../components/admin/SubcategoriesTab";
import ProductsTab from "../../components/admin/ProductsTab";

export default function Products() {
  const [activeTab, setActiveTab] = useState("categories");

  return (
    <div className="flex flex-col w-[70vw] h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-6 bg-gray-100 dark:bg-gray-700/50">
          <TabsTrigger 
            value="categories"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
          >
            Categories
          </TabsTrigger>
          <TabsTrigger 
            value="subcategories"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
          >
            Subcategories
          </TabsTrigger>
          <TabsTrigger 
            value="products"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
          >
            Products
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="flex-1 overflow-auto mt-0">
          <CategoriesTab />
        </TabsContent>

        <TabsContent value="subcategories" className="flex-1 overflow-auto mt-0">
          <SubcategoriesTab />
        </TabsContent>

        <TabsContent value="products" className="flex-1 overflow-auto mt-0">
          <ProductsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}