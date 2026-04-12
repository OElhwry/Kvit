# Kvit

[![Deployed](https://img.shields.io/badge/Deployed-Live-brightgreen)](https://oelhwry.github.io/Kvit/)

**Call it even.** A sleek, modern expense splitter that helps groups settle up with minimal hassle.

Kvit makes splitting bills fair and simple. Whether you're dining out, traveling, or sharing expenses with friends, Kvit calculates who owes what and suggests the most efficient way to settle debts.

## ✨ Features

- **Two Split Modes**: Equal split for fairness, or custom percentages for flexibility
- **Smart Settlements**: Minimizes the number of transactions needed to settle up
- **Visual Balance Tracking**: See at a glance who owes money and who gets paid back
- **Share Options**: Copy as text summary, screenshot image, or shareable link
- **Dark Mode**: Elegant dark theme with a subtle flashlight effect
- **Responsive Design**: Works perfectly on mobile and desktop
- **Offline-First**: No account needed, works entirely in your browser

## 🚀 Live Demo

Try it out: **[https://oelhwry.github.io/Kvit/](https://oelhwry.github.io/Kvit/)**

## 📱 How to Use

1. **Enter the Expense**: Add a description and total amount
2. **Choose Split Mode**:
   - **Equal Split**: Everyone pays the same share
   - **Custom %**: Assign different percentages to each person
3. **Add People**: Include everyone involved (minimum 2 people)
4. **Record Payments**: Enter what each person has already paid
5. **Review Balances**: See who owes money (red) or gets money back (green)
6. **Follow Settlements**: Kvit shows the optimal payment transfers
7. **Share**: Copy the summary as text, image, or a shareable link

## 🛠️ Tech Stack

- **Frontend**: React 19 with modern hooks
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Custom CSS with CSS variables for theming
- **Icons**: Lucide React for consistent iconography
- **Image Export**: html2canvas for generating shareable screenshots
- **Deployment**: GitHub Pages

## 🏃‍♂️ Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/oelhwry/SplitFare.git
cd SplitFare/split-expense-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

### Linting

```bash
npm run lint
```

## 📦 Project Structure

```
split-expense-app/
├── public/
│   └── kvit.png          # App icon
├── src/
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # React entry point
│   ├── index.css         # Global styles
│   └── assets/           # Static assets
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── eslint.config.js      # ESLint configuration
```

## 🎨 Design Philosophy

Kvit embraces a clean, fintech-inspired aesthetic:
- **Stripe-inspired color palette**: Professional blues, greens, and reds
- **Inter font**: Modern, readable typography
- **Subtle animations**: Smooth transitions and hover effects
- **Accessibility**: High contrast ratios and keyboard navigation
- **Mobile-first**: Responsive design that works on all devices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- Inspired by the need for fair and simple expense splitting
- Built with modern React patterns and best practices
- Icons provided by [Lucide](https://lucide.dev/)
