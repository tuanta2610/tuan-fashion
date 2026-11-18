'use strict';

/**
 * Catalogue — TUAN FASHION, Thu Đông 2026 "Lụa & Sương".
 * `image` is an Unsplash photo id (placeholder imagery). Replace with your own
 * photos by putting files in /public/img/products and changing `image` to a path
 * starting with "/" (views handle both).
 * Prices are in VND.
 */
const products = [
  {
    slug: 'wisteria-gown',
    category: 'evening',
    featured: true,
    image: '1566174053879-31528523f8ae',
    name: { vi: 'Đầm dạ hội Tử Đằng', en: 'Wisteria Gown' },
    price: 128000000,
    material: { vi: 'Crepe lụa tơ tằm Bảo Lộc', en: 'Bao Loc mulberry silk crepe' },
    description: {
      vi: 'Phom trễ vai ôm sát, thả dài chạm gót. Lớp crepe lụa được nhuộm màu tử đằng thủ công qua bảy lần để đạt sắc độ sâu, mờ như cánh hoa lúc chạng vạng.',
      en: 'An off-the-shoulder column that falls to the heel. The silk crepe is hand-dyed seven times to reach a deep, dusky wisteria tone.',
    },
    details: {
      vi: ['Corset nội bộ định hình', 'Khóa kéo ẩn bọc lụa', 'May đo theo số đo riêng', 'Hoàn thiện trong 4 – 6 tuần'],
      en: ['Internal shaping corset', 'Silk-covered invisible zip', 'Made to your measurements', 'Completed in 4 – 6 weeks'],
    },
  },
  {
    slug: 'peony-tulle-gown',
    category: 'evening',
    featured: true,
    image: '1568252542512-9fe8fe9c87bb',
    name: { vi: 'Đầm Tulle Mẫu Đơn', en: 'Peony Tulle Gown' },
    price: 185000000,
    material: { vi: 'Tulle Pháp, thêu tay 3D', en: 'French tulle, 3D hand embroidery' },
    description: {
      vi: 'Hơn 1.200 cánh hoa mẫu đơn được thêu tay riêng lẻ rồi đính lên nền tulle mỏng như sương. Mỗi chiếc cần 340 giờ làm việc của nghệ nhân.',
      en: 'More than 1,200 peony petals, each embroidered by hand and set on a mist-light tulle. Every piece takes 340 artisan hours.',
    },
    details: {
      vi: ['Phiên bản giới hạn 12 chiếc', 'Thân áo cúp ngực có gọng', 'Đuôi váy dài 80 cm', 'Kèm túi bảo quản bằng lụa'],
      en: ['Limited to 12 pieces', 'Boned strapless bodice', '80 cm train', 'Silk garment bag included'],
    },
  },
  {
    slug: 'white-mist-gown',
    category: 'evening',
    featured: true,
    image: '1544957992-20514f595d6f',
    name: { vi: 'Đầm Sương Trắng', en: 'White Mist Gown' },
    price: 142000000,
    material: { vi: 'Organza lụa nhiều lớp', en: 'Layered silk organza' },
    description: {
      vi: 'Chín lớp organza lụa chồng lên nhau tạo chuyển động như làn sương sớm. Thiết kế chủ đạo của bộ sưu tập Lụa & Sương.',
      en: 'Nine layers of silk organza move like early-morning mist. The signature piece of the Silk & Mist collection.',
    },
    details: {
      vi: ['Viền lăn tay từng lớp', 'Lót lụa habutai', 'Có thể tùy chỉnh độ dài', 'Hoàn thiện trong 6 – 8 tuần'],
      en: ['Hand-rolled hems on every layer', 'Habotai silk lining', 'Length can be tailored', 'Completed in 6 – 8 weeks'],
    },
  },
  {
    slug: 'vermilion-column-gown',
    category: 'evening',
    image: '1612336307429-8a898d10e223',
    name: { vi: 'Đầm Đỏ Son', en: 'Vermilion Column Gown' },
    price: 112000000,
    material: { vi: 'Satin lụa nặng 30 momme', en: '30 momme silk satin' },
    description: {
      vi: 'Vai cầu vững chãi, tay dài cắt xéo, tà xẻ cao bất đối xứng — một chiếc đầm dành cho khoảnh khắc bước vào căn phòng.',
      en: 'Strong shoulders, bias-cut long sleeves and an asymmetric high slit — a gown made for the moment you enter the room.',
    },
    details: {
      vi: ['Cắt xéo vải (bias cut)', 'Đệm vai thủ công', 'Đuôi váy rời', 'May đo theo số đo riêng'],
      en: ['Bias cut', 'Hand-built shoulders', 'Detachable train', 'Made to your measurements'],
    },
  },
  {
    slug: 'velvet-rose-gown',
    category: 'evening',
    image: '1595777457583-95e059d581b8',
    name: { vi: 'Đầm Hồng Nhung', en: 'Velvet Rose Gown' },
    price: 96000000,
    material: { vi: 'Chiffon lụa hai lớp', en: 'Double silk chiffon' },
    description: {
      vi: 'Chân váy xòe tròn 360 độ, xoay nhẹ là bung như cánh hồng. Thân áo cổ yếm, lưng mở sâu.',
      en: 'A full-circle skirt that blooms like a rose with every turn. Halter bodice, deep open back.',
    },
    details: {
      vi: ['Chân váy xòe tròn', 'Lưng mở sâu', 'Dây yếm có thể điều chỉnh', 'Hoàn thiện trong 4 tuần'],
      en: ['Full-circle skirt', 'Deep open back', 'Adjustable halter', 'Completed in 4 weeks'],
    },
  },
  {
    slug: 'celeste-wrap-gown',
    category: 'evening',
    image: '1539008835657-9e8e9680c956',
    name: { vi: 'Đầm Thiên Thanh', en: 'Celeste Wrap Gown' },
    price: 78000000,
    material: { vi: 'Georgette lụa', en: 'Silk georgette' },
    description: {
      vi: 'Kiểu đắp chéo mềm mại, cổ chữ V sâu và tà xẻ cao. Nhẹ đến mức gần như không trọng lượng — lý tưởng cho dạ tiệc ngoài trời.',
      en: 'A soft wrap silhouette with a deep V and a high slit. Almost weightless — made for evenings outdoors.',
    },
    details: {
      vi: ['Đắp chéo, buộc eo', 'Không lót, thoáng mát', 'Giặt khô', 'Có sẵn size 34 – 42'],
      en: ['Wrap with tie waist', 'Unlined, breathable', 'Dry clean only', 'Available in sizes 34 – 42'],
    },
  },
  {
    slug: 'blush-organza-blouse',
    category: 'ready-to-wear',
    featured: true,
    image: '1581044777550-4cfa60707c03',
    name: { vi: 'Áo Organza Hồng Phấn', en: 'Blush Organza Blouse' },
    price: 34000000,
    material: { vi: 'Organza cotton chấm bi', en: 'Polka-dot cotton organza' },
    description: {
      vi: 'Tay phồng nhiều tầng bèo, cổ trễ vai. Phối cùng quần âu ống rộng cho ngày, hoặc chân váy satin cho tối.',
      en: 'Tiered ruffle sleeves and an off-the-shoulder neckline. Wear it with wide trousers by day, or a satin skirt at night.',
    },
    details: {
      vi: ['Bèo nhún may tay', 'Chun cổ mảnh', 'Cotton organza Ý', 'Có sẵn size 34 – 42'],
      en: ['Hand-gathered ruffles', 'Fine elastic neckline', 'Italian cotton organza', 'Available in sizes 34 – 42'],
    },
  },
  {
    slug: 'bordeaux-sequin-set',
    category: 'ready-to-wear',
    image: '1550614000-4895a10e1bfd',
    name: { vi: 'Bộ Sequin Đỏ Rượu', en: 'Bordeaux Sequin Set' },
    price: 64000000,
    material: { vi: 'Sequin đính tay trên lưới', en: 'Hand-sewn sequins on mesh' },
    description: {
      vi: 'Áo croptop cúp ngực và chân váy xếp ly nhiều tầng. Ánh sequin trầm như rượu vang dưới ánh nến.',
      en: 'A strapless crop top with a tiered pleated skirt. Sequins that glow like wine in candlelight.',
    },
    details: {
      vi: ['Bán theo bộ hoặc lẻ', 'Lót lụa mềm', 'Xếp ly thủ công', 'Có sẵn size 34 – 40'],
      en: ['Sold as a set or separately', 'Soft silk lining', 'Hand pleating', 'Available in sizes 34 – 40'],
    },
  },
  {
    slug: 'petite-fleur-wrap-dress',
    category: 'ready-to-wear',
    image: '1494578379344-d6c710782a3d',
    name: { vi: 'Đầm Wrap Hoa Nhí', en: 'Petite Fleur Wrap Dress' },
    price: 26500000,
    material: { vi: 'Lụa in hoa độc quyền', en: 'Exclusive printed silk' },
    description: {
      vi: 'Họa tiết chim én và nhánh lúa được vẽ tay tại xưởng, in trên lụa mềm. Bèo nhún dọc tà áo tạo chuyển động nhẹ.',
      en: 'A swallow-and-rice-stem motif, hand-drawn in our studio and printed on soft silk. A ruffled edge adds gentle movement.',
    },
    details: {
      vi: ['Họa tiết độc quyền', 'Tay dài bo chun', 'Đắp chéo buộc eo', 'Có sẵn size 34 – 42'],
      en: ['Exclusive print', 'Long sleeves, elastic cuffs', 'Wrap with tie waist', 'Available in sizes 34 – 42'],
    },
  },
  {
    slug: 'camel-wool-coat',
    category: 'outerwear',
    featured: true,
    image: '1618244972963-dbee1a7edc95',
    name: { vi: 'Măng tô Lạc Đà', en: 'Camel Wool Coat' },
    price: 72000000,
    material: { vi: 'Len lông lạc đà Ý', en: 'Italian camel hair' },
    description: {
      vi: 'Dáng suông dài quá gối, ve áo rộng, may tay toàn bộ phần canvas. Một chiếc áo dành cho nhiều thập kỷ.',
      en: 'A long, straight coat with wide lapels and a fully hand-canvassed front. A coat for decades, not seasons.',
    },
    details: {
      vi: ['Canvas may tay toàn phần', 'Lót lụa cupro', 'Khuy sừng tự nhiên', 'Có sẵn size 34 – 42'],
      en: ['Full hand canvas', 'Cupro silk lining', 'Natural horn buttons', 'Available in sizes 34 – 42'],
    },
  },
  {
    slug: 'noir-ruffle-coat',
    category: 'outerwear',
    featured: true,
    image: '1554412933-514a83d2f3c8',
    name: { vi: 'Măng tô Đen Bèo Nhún', en: 'Noir Ruffle Coat' },
    price: 88000000,
    material: { vi: 'Len cashmere pha', en: 'Wool-cashmere blend' },
    description: {
      vi: 'Dáng ôm eo, vạt dài, đường bèo nhún chạy dọc nẹp khuy. Kiêu hãnh và nữ tính trong cùng một nét cắt.',
      en: 'Fitted at the waist with a long skirt and a ruffle tracing the button placket. Proud and feminine in one line.',
    },
    details: {
      vi: ['Bèo nhún cắt xéo', 'Khuy bọc vải', 'Lót lụa', 'May đo theo số đo riêng'],
      en: ['Bias-cut ruffle', 'Fabric-covered buttons', 'Silk lining', 'Made to your measurements'],
    },
  },
  {
    slug: 'pine-check-coat',
    category: 'outerwear',
    image: '1485968579580-b6d095142e6e',
    name: { vi: 'Măng tô Kẻ Rừng Thông', en: 'Pine Check Coat' },
    price: 59000000,
    material: { vi: 'Tweed len Scotland', en: 'Scottish wool tweed' },
    description: {
      vi: 'Kẻ ô xanh rừng thông và chàm, phom oversize vai rơi. Dệt riêng cho TUAN FASHION tại một xưởng gia đình ở Scotland.',
      en: 'A pine-green and indigo check in a dropped-shoulder oversized cut. Woven for TUAN FASHION by a family mill in Scotland.',
    },
    details: {
      vi: ['Vải dệt độc quyền', 'Vai rơi', 'Hai túi ốp', 'Có sẵn size 34 – 42'],
      en: ['Exclusive weave', 'Dropped shoulders', 'Two patch pockets', 'Available in sizes 34 – 42'],
    },
  },
  {
    slug: 'clay-rose-coat',
    category: 'outerwear',
    image: '1485462537746-965f33f7f6a7',
    name: { vi: 'Áo khoác Hồng Đất', en: 'Clay Rose Coat' },
    price: 61000000,
    material: { vi: 'Dạ len hai mặt', en: 'Double-faced wool' },
    description: {
      vi: 'Kỹ thuật may dạ hai mặt không lót, mép áo được khâu giấu bằng tay. Nhẹ, ấm và đứng phom.',
      en: 'Unlined double-faced wool with hand-closed edges. Light, warm and holds its shape.',
    },
    details: {
      vi: ['Dạ hai mặt không lót', 'Đường may giấu thủ công', 'Đai lưng rời', 'Có sẵn size 34 – 42'],
      en: ['Unlined double-faced wool', 'Hand-finished hidden seams', 'Detachable belt', 'Available in sizes 34 – 42'],
    },
  },
  {
    slug: 'honey-cashmere-sweater',
    category: 'knitwear',
    image: '1475180098004-ca77a66827be',
    name: { vi: 'Áo len Cashmere Mật Ong', en: 'Honey Cashmere Sweater' },
    price: 24000000,
    material: { vi: 'Cashmere Mông Cổ 100%', en: '100% Mongolian cashmere' },
    description: {
      vi: 'Họa tiết chevron đan liền mạch hai tông mật ong và kem. Sợi cashmere hai lớp dày dặn, càng mặc càng mềm.',
      en: 'A seamless chevron in honey and cream. Two-ply cashmere that softens with every wear.',
    },
    details: {
      vi: ['Đan liền không đường may', 'Cashmere 2 lớp', 'Phom rộng thoải mái', 'Một size tự do'],
      en: ['Seamless knit', '2-ply cashmere', 'Relaxed fit', 'One size'],
    },
  },
  {
    slug: 'ivory-crochet-cape',
    category: 'knitwear',
    image: '1434389677669-e08b4cac3105',
    name: { vi: 'Áo choàng Móc Ngà', en: 'Ivory Crochet Cape' },
    price: 19500000,
    material: { vi: 'Sợi cotton – lụa móc tay', en: 'Hand-crocheted cotton–silk' },
    description: {
      vi: 'Được móc tay bởi các nghệ nhân ở làng nghề Phú Vinh trong 40 giờ. Tua rua dài mềm, khoác nhẹ trên vai.',
      en: 'Hand-crocheted over 40 hours by artisans of Phu Vinh craft village. Soft long fringe, worn lightly on the shoulders.',
    },
    details: {
      vi: ['Móc tay 100%', 'Hợp tác làng nghề Phú Vinh', 'Tua rua dài 12 cm', 'Một size tự do'],
      en: ['100% hand-crocheted', 'In partnership with Phu Vinh village', '12 cm fringe', 'One size'],
    },
  },
];

products.categories = ['evening', 'ready-to-wear', 'outerwear', 'knitwear'];

module.exports = products;
