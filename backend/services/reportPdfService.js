const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

/*
|--------------------------------------------------------------------------
| MinistryFlow PDF Report Service
|--------------------------------------------------------------------------
|
| Layout:
|
|   ┌──────────────────────────────────────────────┐
|   │  CHURCH LOGO          CHURCH NAME            │
|   │                                              │
|   │              REPORT NAME                    │
|   │                                              │
|   │  ┌────────────────────────────────────────┐  │
|   │  │                                        │  │
|   │  │          REPORT CONTENT                │  │
|   │  │                                        │  │
|   │  └────────────────────────────────────────┘  │
|   │                                              │
|   │       COPYRIGHT / OFFICIAL DOCUMENT         │
|   └──────────────────────────────────────────────┘
|
|--------------------------------------------------------------------------
*/


// ============================================================================
// COLORS
// ============================================================================

const COLORS = {
  black: "#111111",
  dark: "#222222",
  gray: "#666666",
  mediumGray: "#999999",
  lightGray: "#D9D9D9",
  veryLightGray: "#F5F5F5",
  white: "#FFFFFF",
};


// ============================================================================
// A4 PAGE SETTINGS
// ============================================================================

const PAGE = {
  width: 595.28,
  height: 841.89,

  margin: 42,

  headerTop: 42,

  logoSize: 58,

  contentTop: 175,

  // IMPORTANT:
  // Keep the content box above the footer.
  contentBottom: 730,

  footerTop: 755,
};


// ============================================================================
// GENERAL HELPERS
// ============================================================================

const formatCurrency = (value) => {
  return `GHS ${Number(value || 0).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};


const formatLabel = (value) => {
  if (!value) return "Unknown";

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};


const formatDate = () => {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};


// ============================================================================
// CHURCH SETTINGS
// ============================================================================

const getChurchName = () => {
  return (
    process.env.CHURCH_NAME ||
    process.env.MINISTRY_NAME ||
    "MinistryFlow Church"
  );
};


const getLogoPath = () => {
  if (!process.env.CHURCH_LOGO_PATH) {
    return null;
  }

  const logoPath = path.resolve(
    process.env.CHURCH_LOGO_PATH
  );

  if (fs.existsSync(logoPath)) {
    return logoPath;
  }

  return null;
};


// ============================================================================
// CHURCH LOGO
// ============================================================================

const drawLogo = (doc) => {
  const x = PAGE.margin;
  const y = PAGE.headerTop;

  const logoPath = getLogoPath();

  /*
  |--------------------------------------------------------------------------
  | Real Church Logo
  |--------------------------------------------------------------------------
  */

  if (logoPath) {
    try {
      doc.image(logoPath, x, y, {
        fit: [
          PAGE.logoSize,
          PAGE.logoSize,
        ],
        align: "center",
        valign: "center",
      });

      return;
    } catch (error) {
      console.warn(
        "Unable to load church logo:",
        error.message
      );
    }
  }


  /*
  |--------------------------------------------------------------------------
  | Temporary Logo Placeholder
  |--------------------------------------------------------------------------
  */

  const centerX =
    x + PAGE.logoSize / 2;

  const centerY =
    y + PAGE.logoSize / 2;

  const radius =
    PAGE.logoSize / 2;


  doc
    .save()
    .circle(
      centerX,
      centerY,
      radius
    )
    .lineWidth(1.3)
    .strokeColor(COLORS.black)
    .stroke();


  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(COLORS.black)
    .text(
      "CHURCH\nLOGO",
      x,
      y + 19,
      {
        width: PAGE.logoSize,
        align: "center",
        lineGap: 1,
      }
    )
    .restore();
};


// ============================================================================
// HEADER
// ============================================================================

const drawHeader = (
  doc,
  reportTitle
) => {
  const logoX = PAGE.margin;
  const logoY = PAGE.headerTop;

  drawLogo(doc);


  /*
  |--------------------------------------------------------------------------
  | Church Name
  |--------------------------------------------------------------------------
  */

  const churchNameX =
    logoX +
    PAGE.logoSize +
    25;

  const availableWidth =
    PAGE.width -
    churchNameX -
    PAGE.margin;


  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor(COLORS.black)
    .text(
      getChurchName().toUpperCase(),
      churchNameX,
      logoY + 8,
      {
        width: availableWidth,
        align: "center",
      }
    );


  /*
  |--------------------------------------------------------------------------
  | System Name
  |--------------------------------------------------------------------------
  */

  doc
    .font("Helvetica")
    .fontSize(7.5)
    .fillColor(COLORS.gray)
    .text(
      "MINISTRY MANAGEMENT SYSTEM",
      churchNameX,
      logoY + 37,
      {
        width: availableWidth,
        align: "center",
        characterSpacing: 0.8,
      }
    );


  /*
  |--------------------------------------------------------------------------
  | Header Divider
  |--------------------------------------------------------------------------
  */

  const dividerY =
    logoY +
    PAGE.logoSize +
    13;


  doc
    .moveTo(
      PAGE.margin,
      dividerY
    )
    .lineTo(
      PAGE.width - PAGE.margin,
      dividerY
    )
    .lineWidth(1)
    .strokeColor(COLORS.black)
    .stroke();


  /*
  |--------------------------------------------------------------------------
  | Report Name
  |--------------------------------------------------------------------------
  */

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor(COLORS.black)
    .text(
      reportTitle.toUpperCase(),
      PAGE.margin,
      dividerY + 12,
      {
        width:
          PAGE.width -
          PAGE.margin * 2,
        align: "center",
      }
    );


  /*
  |--------------------------------------------------------------------------
  | Generated Date
  |--------------------------------------------------------------------------
  */

  doc
    .font("Helvetica")
    .fontSize(7.5)
    .fillColor(COLORS.gray)
    .text(
      `Generated ${formatDate()}`,
      PAGE.margin,
      dividerY + 31,
      {
        width:
          PAGE.width -
          PAGE.margin * 2,
        align: "center",
      }
    );
};


// ============================================================================
// CONTENT BOX
// ============================================================================

const drawContentBox = (doc) => {
  const x = PAGE.margin;
  const y = PAGE.contentTop;

  const width =
    PAGE.width -
    PAGE.margin * 2;

  const height =
    PAGE.contentBottom -
    PAGE.contentTop;


  /*
  |--------------------------------------------------------------------------
  | Main Report Box
  |--------------------------------------------------------------------------
  */

  doc
    .roundedRect(
      x,
      y,
      width,
      height,
      5
    )
    .lineWidth(1.2)
    .strokeColor(COLORS.black)
    .stroke();


  return {
    x,
    y,
    width,
    height,

    innerX: x + 20,
    innerY: y + 20,

    innerWidth:
      width - 40,

    bottom:
      PAGE.contentBottom - 20,
  };
};


// ============================================================================
// FOOTER
// ============================================================================

const drawFooter = (doc) => {
  const footerY =
    PAGE.footerTop;


  /*
  |--------------------------------------------------------------------------
  | Footer Divider
  |--------------------------------------------------------------------------
  */

  doc
    .save()
    .moveTo(
      PAGE.margin,
      footerY
    )
    .lineTo(
      PAGE.width - PAGE.margin,
      footerY
    )
    .lineWidth(0.8)
    .strokeColor(COLORS.lightGray)
    .stroke();


  /*
  |--------------------------------------------------------------------------
  | Copyright
  |--------------------------------------------------------------------------
  */

  doc
    .font("Helvetica")
    .fontSize(7.5)
    .fillColor(COLORS.gray)
    .text(
      `© ${new Date().getFullYear()} ${getChurchName()} • Official MinistryFlow Report`,
      PAGE.margin,
      footerY + 9,
      {
        width:
          PAGE.width -
          PAGE.margin * 2,
        align: "center",
      }
    );


  /*
  |--------------------------------------------------------------------------
  | Official Document
  |--------------------------------------------------------------------------
  */

  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .fillColor(COLORS.gray)
    .text(
      "OFFICIAL DOCUMENT",
      PAGE.margin,
      footerY + 24,
      {
        width:
          PAGE.width -
          PAGE.margin * 2,
        align: "center",
        characterSpacing: 0.8,
      }
    )
    .restore();
};


// ============================================================================
// DOCUMENT CREATION
// ============================================================================

const createDocument = (
  reportTitle,
  filename,
  res
) => {
  const doc = new PDFDocument({
    size: "A4",

    /*
    |--------------------------------------------------------------------------
    | IMPORTANT
    |--------------------------------------------------------------------------
    |
    | We use a smaller bottom margin because the footer is
    | positioned manually.
    |
    */

    margins: {
      top: PAGE.margin,
      bottom: PAGE.margin,
      left: PAGE.margin,
      right: PAGE.margin,
    },

    autoFirstPage: true,
  });


  res.setHeader(
    "Content-Type",
    "application/pdf"
  );


  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${filename}"`
  );


  doc.pipe(res);


  /*
  |--------------------------------------------------------------------------
  | Draw static page layout FIRST
  |--------------------------------------------------------------------------
  */

  drawHeader(
    doc,
    reportTitle
  );


  const content =
    drawContentBox(doc);


  return {
    doc,
    content,
  };
};


// ============================================================================
// SECTION TITLE
// ============================================================================

const addSectionTitle = (
  doc,
  title,
  x,
  y,
  width
) => {
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(COLORS.black)
    .text(
      title.toUpperCase(),
      x,
      y,
      {
        width,
      }
    );


  const lineY =
    y + 15;


  doc
    .moveTo(
      x,
      lineY
    )
    .lineTo(
      x + width,
      lineY
    )
    .lineWidth(0.6)
    .strokeColor(COLORS.lightGray)
    .stroke();


  return lineY + 11;
};


// ============================================================================
// METRIC CARD
// ============================================================================

const drawMetricCard = (
  doc,
  x,
  y,
  width,
  height,
  label,
  value
) => {
  /*
  |--------------------------------------------------------------------------
  | Card
  |--------------------------------------------------------------------------
  */

  doc
    .roundedRect(
      x,
      y,
      width,
      height,
      4
    )
    .fillColor(
      COLORS.veryLightGray
    )
    .fill();


  doc
    .roundedRect(
      x,
      y,
      width,
      height,
      4
    )
    .lineWidth(0.7)
    .strokeColor(
      COLORS.lightGray
    )
    .stroke();


  /*
  |--------------------------------------------------------------------------
  | Label
  |--------------------------------------------------------------------------
  */

  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .fillColor(COLORS.gray)
    .text(
      label.toUpperCase(),
      x + 8,
      y + 10,
      {
        width: width - 16,
        align: "center",
      }
    );


  /*
  |--------------------------------------------------------------------------
  | Value
  |--------------------------------------------------------------------------
  */

  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor(COLORS.black)
    .text(
      String(value),
      x + 8,
      y + 29,
      {
        width: width - 16,
        align: "center",
      }
    );
};


// ============================================================================
// METRIC CARDS
// ============================================================================

const drawMetricCards = (
  doc,
  cards,
  x,
  y,
  width
) => {
  const gap = 10;

  const cardWidth =
    cards.length === 1
      ? Math.min(170, width)
      : (
        width -
        gap * (cards.length - 1)
      ) / cards.length;


  const cardHeight = 60;


  cards.forEach(
    (card, index) => {
      drawMetricCard(
        doc,

        x +
        index *
        (cardWidth + gap),

        y,

        cardWidth,

        cardHeight,

        card.label,

        card.value
      );
    }
  );


  return y + cardHeight;
};


// ============================================================================
// TABLE
// ============================================================================

const drawTable = (
  doc,
  columns,
  rows,
  x,
  y,
  width
) => {
  const headerHeight = 24;
  const rowHeight = 22;

  const columnWidth =
    width / columns.length;


  /*
  |--------------------------------------------------------------------------
  | Header Background
  |--------------------------------------------------------------------------
  */

  doc
    .rect(
      x,
      y,
      width,
      headerHeight
    )
    .fillColor(COLORS.black)
    .fill();


  /*
  |--------------------------------------------------------------------------
  | Header Text
  |--------------------------------------------------------------------------
  */

  columns.forEach(
    (column, index) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(COLORS.white)
        .text(
          column.toUpperCase(),
          x +
          index *
          columnWidth +
          8,

          y + 8,

          {
            width:
              columnWidth - 16,

            align:
              index === 0
                ? "left"
                : "right",
          }
        );
    }
  );


  /*
  |--------------------------------------------------------------------------
  | Rows
  |--------------------------------------------------------------------------
  */

  rows.forEach(
    (row, rowIndex) => {
      const rowY =
        y +
        headerHeight +
        rowIndex *
        rowHeight;


      /*
      | Alternating background
      */

      if (rowIndex % 2 === 0) {
        doc
          .rect(
            x,
            rowY,
            width,
            rowHeight
          )
          .fillColor(
            COLORS.veryLightGray
          )
          .fill();
      }


      /*
      | Cell values
      */

      columns.forEach(
        (column, columnIndex) => {
          const value =
            row[columnIndex] ===
              null ||
              row[columnIndex] ===
              undefined
              ? ""
              : String(
                row[columnIndex]
              );


          doc
            .font("Helvetica")
            .fontSize(8)
            .fillColor(
              COLORS.black
            )
            .text(
              value,

              x +
              columnIndex *
              columnWidth +
              8,

              rowY + 7,

              {
                width:
                  columnWidth -
                  16,

                align:
                  columnIndex === 0
                    ? "left"
                    : "right",
              }
            );
        }
      );


      /*
      | Row divider
      */

      doc
        .moveTo(
          x,
          rowY + rowHeight
        )
        .lineTo(
          x + width,
          rowY + rowHeight
        )
        .lineWidth(0.5)
        .strokeColor(
          COLORS.lightGray
        )
        .stroke();
    }
  );


  /*
  |--------------------------------------------------------------------------
  | Outer border
  |--------------------------------------------------------------------------
  */

  const tableHeight =
    headerHeight +
    rows.length *
    rowHeight;


  doc
    .rect(
      x,
      y,
      width,
      tableHeight
    )
    .lineWidth(0.7)
    .strokeColor(
      COLORS.lightGray
    )
    .stroke();


  return (
    y +
    tableHeight
  );
};


// ============================================================================
// INFORMATION ROW
// ============================================================================

const drawInfoRow = (
  doc,
  label,
  value,
  x,
  y,
  width
) => {
  const labelWidth =
    width * 0.42;

  const valueWidth =
    width * 0.58;


  doc
    .font("Helvetica-Bold")
    .fontSize(8.5)
    .fillColor(COLORS.dark)
    .text(
      label,
      x,
      y,
      {
        width: labelWidth,
      }
    );


  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor(COLORS.black)
    .text(
      String(value),
      x + labelWidth,
      y,
      {
        width: valueWidth,
        align: "right",
      }
    );


  doc
    .moveTo(
      x,
      y + 16
    )
    .lineTo(
      x + width,
      y + 16
    )
    .lineWidth(0.4)
    .strokeColor(
      COLORS.lightGray
    )
    .stroke();


  return y + 24;
};


// ============================================================================
// MEMBER REPORT
// ============================================================================

const generateMemberReportPdf = (
  report,
  res
) => {
  const {
    doc,
    content,
  } = createDocument(
    "Member Report",
    "ministryflow-member-report.pdf",
    res
  );


  let y =
    content.innerY;


  /*
  |--------------------------------------------------------------------------
  | Membership Summary
  |--------------------------------------------------------------------------
  */

  y =
    addSectionTitle(
      doc,
      "Membership Summary",
      content.innerX,
      y,
      content.innerWidth
    );


  y += 5;


  y =
    drawMetricCards(
      doc,

      [
        {
          label:
            "Total Members",

          value:
            report.totalMembers ??
            0,
        },

        {
          label:
            "Active Members",

          value:
            report.activeMembers ??
            0,
        },

        {
          label:
            "Inactive Members",

          value:
            report.inactiveMembers ??
            0,
        },
      ],

      content.innerX,

      y,

      content.innerWidth
    );


  y += 26;


  /*
  |--------------------------------------------------------------------------
  | Gender Distribution
  |--------------------------------------------------------------------------
  */

  y =
    addSectionTitle(
      doc,
      "Gender Distribution",
      content.innerX,
      y,
      content.innerWidth
    );


  y += 5;


  if (
    Array.isArray(
      report.genderDistribution
    ) &&
    report.genderDistribution.length >
    0
  ) {
    const rows =
      report.genderDistribution.map(
        (item) => [
          formatLabel(item._id),
          item.count ?? 0,
        ]
      );


    drawTable(
      doc,
      ["Gender", "Members"],
      rows,
      content.innerX,
      y,
      content.innerWidth
    );
  } else {
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(COLORS.gray)
      .text(
        "No gender distribution data available.",
        content.innerX,
        y
      );
  }


  /*
  |--------------------------------------------------------------------------
  | Footer
  |--------------------------------------------------------------------------
  */

  drawFooter(doc);


  doc.end();
};


// ============================================================================
// ATTENDANCE REPORT
// ============================================================================

const generateAttendanceReportPdf = (
  report,
  res
) => {
  const {
    doc,
    content,
  } = createDocument(
    "Attendance Report",
    "ministryflow-attendance-report.pdf",
    res
  );


  let y =
    content.innerY;


  /*
  |--------------------------------------------------------------------------
  | Attendance Summary
  |--------------------------------------------------------------------------
  */

  y =
    addSectionTitle(
      doc,
      "Attendance Summary",
      content.innerX,
      y,
      content.innerWidth
    );


  y += 5;


  y =
    drawMetricCards(
      doc,

      [
        {
          label:
            "Total Attendance",

          value:
            report.totalAttendance ??
            0,
        },
      ],

      content.innerX,

      y,

      content.innerWidth
    );


  y += 26;


  /*
  |--------------------------------------------------------------------------
  | Service Breakdown
  |--------------------------------------------------------------------------
  */

  y =
    addSectionTitle(
      doc,
      "Service Breakdown",
      content.innerX,
      y,
      content.innerWidth
    );


  y += 5;


  if (
    Array.isArray(
      report.serviceBreakdown
    ) &&
    report.serviceBreakdown.length >
    0
  ) {
    const rows =
      report.serviceBreakdown.map(
        (item) => [
          formatLabel(item._id),
          item.total ?? 0,
        ]
      );


    drawTable(
      doc,
      ["Service", "Attendance"],
      rows,
      content.innerX,
      y,
      content.innerWidth
    );
  } else {
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(COLORS.gray)
      .text(
        "No attendance breakdown data available.",
        content.innerX,
        y
      );
  }


  drawFooter(doc);


  doc.end();
};


// ============================================================================
// FINANCE REPORT
// ============================================================================

const generateFinanceReportPdf = (
  report,
  res
) => {
  const {
    doc,
    content,
  } = createDocument(
    "Finance Report",
    "ministryflow-finance-report.pdf",
    res
  );


  let y =
    content.innerY;


  /*
  |--------------------------------------------------------------------------
  | Financial Summary
  |--------------------------------------------------------------------------
  */

  y =
    addSectionTitle(
      doc,
      "Financial Summary",
      content.innerX,
      y,
      content.innerWidth
    );


  y += 5;


  y =
    drawMetricCards(
      doc,

      [
        {
          label:
            "Total Income",

          value:
            formatCurrency(
              report.income
            ),
        },

        {
          label:
            "Total Expenses",

          value:
            formatCurrency(
              report.expenses
            ),
        },

        {
          label:
            "Balance",

          value:
            formatCurrency(
              report.balance
            ),
        },
      ],

      content.innerX,

      y,

      content.innerWidth
    );


  y += 26;


  /*
  |--------------------------------------------------------------------------
  | Monthly Finance
  |--------------------------------------------------------------------------
  */

  y =
    addSectionTitle(
      doc,
      "Monthly Finance",
      content.innerX,
      y,
      content.innerWidth
    );


  y += 5;


  if (
    Array.isArray(
      report.monthly
    ) &&
    report.monthly.length >
    0
  ) {
    const rows =
      report.monthly.map(
        (item) => {
          const year =
            item._id?.year ??
            "";

          const month =
            item._id?.month ??
            "";


          return [
            `${month}/${year}`,
            formatCurrency(
              item.total
            ),
          ];
        }
      );


    drawTable(
      doc,
      ["Period", "Amount"],
      rows,
      content.innerX,
      y,
      content.innerWidth
    );
  } else {
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(COLORS.gray)
      .text(
        "No monthly finance data available.",
        content.innerX,
        y
      );
  }


  drawFooter(doc);


  doc.end();
};


// ============================================================================
// OVERVIEW REPORT
// ============================================================================

const generateOverviewReportPdf = (
  report,
  res
) => {
  const {
    doc,
    content,
  } = createDocument(
    "Ministry Overview Report",
    "ministryflow-overview-report.pdf",
    res
  );


  let y =
    content.innerY;


  /*
  |--------------------------------------------------------------------------
  | Ministry Overview
  |--------------------------------------------------------------------------
  */

  y =
    addSectionTitle(
      doc,
      "Ministry Overview",
      content.innerX,
      y,
      content.innerWidth
    );


  y += 5;


  y =
    drawMetricCards(
      doc,

      [
        {
          label:
            "Total Members",

          value:
            report.members ??
            0,
        },

        {
          label:
            "Total Events",

          value:
            report.events ??
            0,
        },

        {
          label:
            "Total Donations",

          value:
            formatCurrency(
              report.donations
            ),
        },
      ],

      content.innerX,

      y,

      content.innerWidth
    );


  y += 28;


  /*
  |--------------------------------------------------------------------------
  | Report Information
  |--------------------------------------------------------------------------
  */

  y =
    addSectionTitle(
      doc,
      "Report Information",
      content.innerX,
      y,
      content.innerWidth
    );


  y += 8;


  y =
    drawInfoRow(
      doc,
      "Church",
      getChurchName(),
      content.innerX,
      y,
      content.innerWidth
    );


  y =
    drawInfoRow(
      doc,
      "Report",
      "Ministry Overview Report",
      content.innerX,
      y,
      content.innerWidth
    );


  y =
    drawInfoRow(
      doc,
      "Generated",
      formatDate(),
      content.innerX,
      y,
      content.innerWidth
    );


  /*
  |--------------------------------------------------------------------------
  | Footer
  |--------------------------------------------------------------------------
  */

  drawFooter(doc);


  /*
  |--------------------------------------------------------------------------
  | Finish PDF
  |--------------------------------------------------------------------------
  */

  doc.end();
};


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  generateMemberReportPdf,
  generateAttendanceReportPdf,
  generateFinanceReportPdf,
  generateOverviewReportPdf,
};