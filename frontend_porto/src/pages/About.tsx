

import NavHeader from '../components/header/NavHeader';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavHeader />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-6 flex items-center">
            <InformationCircleIcon className="w-8 h-8 mr-2 text-blue-600" />
            About Us
          </h1>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Mwananchi Communications LTD
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Mwananchi Communications Limited is a subsidiary of Nation Media Group. It is the leading print media company in Tanzania with print as well as online platforms. It was established in May 1999 as a Media Communication Limited and transformed to the advertising & public relations agency in year 2001 and was later acquired by Nation Media Group in the year 2002.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Through Newspapers, we deliver a literate and informed audience who are opinion leaders, early adopters, and heavy consumers of different brands and services. Our print also delivers a mass market audience ranging from the young and upwardly mobile to the lower/middle class who are the mainstay of the Tanzania economy.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Our Digital platforms provide you with an urban and peri-urban audience and allow you a window into the world. It is the most effective way to reach anybody out there, both local and international, with an interest in the Tanzania and East Africa market.
            </p>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}