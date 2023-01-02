import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography, Button } from "@mui/material";

import config from '../../../config';
import NumericInput from "../../common/NumericInput";
import ethIcon from "../../../assets/images/eth-black.svg";
import commaSeparatedString from '../../../utils/commaSeparatedString'

const { colors } = config.PROJECT;

const sx = {
  root: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "458px",
    width: "100%",
    margin: "auto",
    mb: 3,
    padding: '1em 2em 1.5em 2em',
    backgroundColor: colors.background,
    minHeight: 200,
    display: "flex",
    justifyContent: "center",
    border: `1px solid ${colors.highlight}`,
    borderRadius: 2,
    marginTop: 4,
  },
  title: {
    color: colors.text,
    textAlign: "center",
    fontSize: 22,
    fontWeight: 700,
    mb: 3,
  },
  text: {
    fontFamily: "roboto-bold",
    textTransform: "uppercase",
    fontWeight: 700,
    fontSize: 12,
    alignSelf: "center",
  },
  span: {
    textTransform: "none",
    fontWeight: 500,
    fontSize: 12,
    opacity: 0.5,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    borderBottom: 1,
    minHeight: "30px",
    borderColor: "rgba(0,0,0,0.2)",
    justifyContent: "space-between",
  },
  img: {
    height: "12px",
    alignSelf: "center",
    marginRight: "3px",
    marginBottom: "2px",
    filter: config.PROJECT.id === 'chimerapillars' ? "invert(100%)" : "none",
  },
  mintBtn: {
    fontSize: 16,
    minWidth: "150px",
    height: "40px",
    backgroundColor: colors.highlight,
    color: colors.text,
    borderRadius: "22px",
    cursor: "pointer",
    display: "flex",
    margin: "auto",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "roboto-bold",
    transition: "all .3s",
    textTransform: "unset",
    "&:hover": {
      backgroundColor: colors.highlight,
    },
    "&:focus": {
      outlineColor: colors.primary,
    },
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.5,
    },
  },
};
const MintQuantity = ({ title, price, maxAmount, discounts, onClickMint }) => {
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setTotalPrice(Number((price * quantity).toFixed(3)));
  }, [quantity, price]);

  const onNumberInput = (val) => {
    setQuantity(val);
  };

	// Check for discounts.
	let activeDiscount
	let discountNames
	if (!!discounts?.length) {
		activeDiscount = discounts[0]
		discountNames = commaSeparatedString(discounts.map(discount => discount.name))
	}

  return (
    <Box sx={sx.root}>
      <Typography sx={sx.title} style={{ marginBottom: 8 }}>{title}</Typography>

      {activeDiscount && (
        <Typography sx={{ fontStyle: 'italic', fontSize: '0.85em', marginBottom: 4 }}>
          {activeDiscount.percentOff === 100
            ? `*FREE mint for holding ${discountNames} NFT${discounts.length > 1 ? 's' : ''}`
            : `Discount applied for holding ${discountNames} NFT${discounts.length > 1 ? 's' : ''}`
            // : `*${activeDiscount.percentOff}% discount applied for holding ${discountNames} NFT${discounts.length > 1 ? 's' : ''}`
          }
        </Typography>
      )}

      <Box sx={sx.row}>
        <Typography sx={sx.text} variant="text">
          Quantity{" "}
          <Typography sx={sx.span} component="span">
            ({maxAmount} max)
          </Typography>
        </Typography>
        <Typography sx={sx.text} variant="text">
          Price
        </Typography>
      </Box>

      <Box sx={{ ...sx.row, mb: 4 }}>
        <Typography sx={sx.text} variant="text">
          <NumericInput
            value={1}
            max={maxAmount}
            min={0}
            onChange={onNumberInput}
          />
        </Typography>
        <Box display="flex">
          <img src={ethIcon} style={sx.img} alt="Eth" />
          <Typography sx={{ ...sx.text, fontSize: 16 }} variant="text">
            {totalPrice}
          </Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        sx={sx.mintBtn}
        onClick={() => onClickMint(quantity, totalPrice)}
        disabled={quantity == 0}
      >
        Mint
      </Button>
    </Box>
  );
};

/* eslint-disable react/forbid-prop-types */
MintQuantity.propTypes = {
  title: PropTypes.string.isRequired,
  maxAmount: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  onClickMint: PropTypes.any.isRequired,
};

export default MintQuantity;
